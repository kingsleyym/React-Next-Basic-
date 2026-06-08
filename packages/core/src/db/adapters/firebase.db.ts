/**
 * Firestore implementation of DbService. Reference adapter — excluded from
 * default typecheck. The only file that imports Firestore. See docs/DATA-LAYER.md
 * and docs/BACKEND-PROVIDERS.md.
 */
import {
  getFirestore,
  collection as fsCollection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query as fsQuery,
  where as fsWhere,
  orderBy as fsOrderBy,
  limit as fsLimit,
  type Firestore,
  type WhereFilterOp,
  type QueryConstraint,
} from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';

import type { DbService, QueryOptions, WhereOp, WithId } from '../db.service';

const OP_MAP: Record<WhereOp, WhereFilterOp> = {
  eq: '==',
  neq: '!=',
  lt: '<',
  lte: '<=',
  gt: '>',
  gte: '>=',
  in: 'in',
};

function constraints(options?: QueryOptions): QueryConstraint[] {
  const out: QueryConstraint[] = [];
  for (const w of options?.where ?? []) out.push(fsWhere(w.field, OP_MAP[w.op], w.value));
  if (options?.orderBy) out.push(fsOrderBy(options.orderBy.field, options.orderBy.direction));
  if (options?.limit != null) out.push(fsLimit(options.limit));
  return out;
}

export function createFirebaseDb(app: FirebaseApp): DbService {
  const db: Firestore = getFirestore(app);

  return {
    async get<T>(name: string, id: string) {
      const snap = await getDoc(doc(db, name, id));
      return snap.exists() ? ({ ...(snap.data() as T), id: snap.id } as WithId<T>) : null;
    },
    async list<T>(name: string, options?: QueryOptions) {
      const snap = await getDocs(fsQuery(fsCollection(db, name), ...constraints(options)));
      return snap.docs.map((d) => ({ ...(d.data() as T), id: d.id }) as WithId<T>);
    },
    async create<T>(name: string, data: T, id?: string) {
      if (id) {
        await setDoc(doc(db, name, id), data as object);
        return { ...(data as T), id } as WithId<T>;
      }
      const refDoc = await addDoc(fsCollection(db, name), data as object);
      return { ...(data as T), id: refDoc.id } as WithId<T>;
    },
    async update<T>(name: string, id: string, data: Partial<T>) {
      await updateDoc(doc(db, name, id), data as object);
    },
    async remove(name: string, id: string) {
      await deleteDoc(doc(db, name, id));
    },
    subscribe<T>(name: string, options: QueryOptions, callback: (items: WithId<T>[]) => void) {
      const q = fsQuery(fsCollection(db, name), ...constraints(options));
      return onSnapshot(q, (snap) => {
        callback(snap.docs.map((d) => ({ ...(d.data() as T), id: d.id }) as WithId<T>));
      });
    },
  };
}
