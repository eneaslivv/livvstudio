
import { useState, useEffect } from 'react';
import { 
    collection, 
    onSnapshot, 
    query, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc,
    DocumentData 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useFirestore = <T extends DocumentData>(collectionName: string) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Detectar si estamos usando las credenciales por defecto (marcador de posición)
        // Si no hay una configuración real, desactivamos el loading para permitir el uso de mocks
        const isDefaultConfig = !process.env.REACT_APP_API_KEY || process.env.REACT_APP_API_KEY === "TU_API_KEY";

        if (isDefaultConfig) {
            console.warn(`Firestore: Usando modo local/mock para la colección "${collectionName}" debido a falta de configuración.`);
            setLoading(false);
            return;
        }

        try {
            const q = query(collection(db, collectionName));
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const results: T[] = [];
                snapshot.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() } as T);
                });
                setData(results);
                setLoading(false);
            }, (err) => {
                console.error("Error fetching collection:", err);
                setError(err.message);
                setLoading(false);
            });

            // Timeout de seguridad: si no responde en 3 segundos, asumimos error o desconexión
            const timer = setTimeout(() => {
                if (loading) setLoading(false);
            }, 3000);

            return () => {
                unsubscribe();
                clearTimeout(timer);
            };
        } catch (err: any) {
            console.error("Firebase init error:", err);
            setError("Firebase not configured or invalid credentials");
            setLoading(false);
        }
    }, [collectionName]);

    const add = async (item: any) => {
        try {
            await addDoc(collection(db, collectionName), item);
        } catch (e) {
            console.error("Error adding doc:", e);
        }
    };

    const update = async (id: string, updates: any) => {
        try {
            await updateDoc(doc(db, collectionName, id), updates);
        } catch (e) {
            console.error("Error updating doc:", e);
        }
    };

    const remove = async (id: string) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
        } catch (e) {
            console.error("Error deleting doc:", e);
        }
    };

    return { data, loading, error, add, update, remove };
};
