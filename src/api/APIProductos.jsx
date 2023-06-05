import { db } from "./firebase.config";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const conexion = collection(db, "productos");

export async function InsertarProductos(p) {
  try {
    const data = await addDoc(conexion, p);
    const id = data.id;
    return id;
  } catch (error) {
    console.log(error);
  }
}

export async function SubirImgStorage(id, file) {
  const storage = getStorage();
  const nombre = ref(storage, `productos/${id}.png`);
  await uploadBytes(nombre, file);
  const url = await getDownloadURL(nombre);
  return url;
}

export async function EditarUrlImg(id, url) {
  await updateDoc(doc(db, "productos", id), { icono: url });
}

export async function ValidarDatosRepetidos(p) {
  try {
    const rpt = [];
    const q = query(conexion, where("descripcion", "==", p.descripcion));
    const queryConsulta = await getDocs(q);
    queryConsulta.forEach((doc) => {
      rpt.push(doc.data());
    });
    return rpt.length;
  } catch (error) {
    console.log(error);
  }
}
