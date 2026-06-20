import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useInventoryStore } from '../store/useInventoryStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useJurnalStore } from '../store/useJurnalStore';
import { useRequestStore } from '../store/useRequestStore';

export const syncToCloud = async (uid: string) => {
  if (!uid) return;
  
  const data = {
    accounts: useInventoryStore.getState().accounts,
    wishlist: useWishlistStore.getState().items,
    jurnal: useJurnalStore.getState().entries,
    requests: useRequestStore.getState().orders,
    lastSynced: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'users', uid), data);
    return true;
  } catch (error) {
    console.error("Error syncing to cloud: ", error);
    return false;
  }
};

export const fetchFromCloud = async (uid: string) => {
  if (!uid) return;

  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      if (data.accounts) useInventoryStore.getState().setAllAccounts(data.accounts);
      if (data.wishlist) useWishlistStore.getState().setAllItems(data.wishlist);
      if (data.jurnal) useJurnalStore.getState().setAllEntries(data.jurnal);
      if (data.requests) useRequestStore.getState().setAllOrders(data.requests);
      
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error fetching from cloud: ", error);
    return false;
  }
};
