import styled from "styled-components";
import sinfoto from "../assets/sinfoto_.png";
import { BtnOperaciones } from "../components/BtnOperaciones";
import { Spinner } from "../components/Spinner";
import { FcPicture } from "react-icons/fc";
import { FiSend } from "react-icons/fi";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  InsertarProductos,
  EditarUrlImg,
  SubirImgStorage,
  ValidarDatosRepetidos,
} from "../api/APIProductos";
import swal from "sweetalert";

export function ProductosConfig() {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(sinfoto);
  const [file, setFile] = useState([]);
  const [estadoImg, setEstadoImg] = useState(false);

  const ref = useRef(null);

  function abrirImagenes() {
    ref.current.click();
  }
  function subirImgStorage(e) {
    // Carga local
    let fileLocal = e.target.files;
    let fileReaderLocal = new FileReader();
    fileReaderLocal.readAsDataURL(fileLocal[0]);
    const tipoImg = e.target.files[0];

    if (tipoImg.type.includes("image/png")) {
      if (fileReaderLocal && fileLocal && fileLocal.length) {
        fileReaderLocal.onload = function load() {
          setFileUrl(fileReaderLocal.result);
        };
        // Preparar img para Storage
        let fileList = e.target.files;
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(fileList[0]);
        fileReader.onload = function () {
          let imagenData = fileReader.result;
          setFile(imagenData);
        };
      }
    }

    // Carga
  }
  async function insertar(data) {
    const img = file.length;
    if (img != 0) {
      setLoading(true);
      setEstadoImg(false);
      const p = {
        descripcion: data.descripcion,
        precio: data.precio,
        icono: "-",
      };
      const rptRepetidos = await ValidarDatosRepetidos(p);
      if (rptRepetidos == 0) {
        const id = await InsertarProductos(p);
        const respuestaUrl = await SubirImgStorage(id, file);
        await EditarUrlImg(id, respuestaUrl);
        setLoading(false);
        reset({ descripcion: "", precio: "" });
        setFileUrl(sinfoto);
        swal({
          title: "Good job!",
          text: "You clicked the button!",
          icon: "success",
        });
      } else {
        setLoading(false);
        swal({
          title: "Datos Repetidos",
          text: "Ya tienes un registro con esa descripción",
          icon: "warning",
        });
      }
    } else {
      setEstadoImg(true);
    }
  }

  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <Container>
      <div className="sub-contenedor">
        {loading ? <Spinner /> : ""}
        <div className="header">
          <h1>📝 Registro de Productos 📝</h1>
        </div>
        <div className="pictureContainer">
          <img src={fileUrl} />
          <BtnOperaciones
            titulo=" Cargar Imagen"
            icono={<FcPicture />}
            funcion={abrirImagenes}
          />
          <input
            ref={ref}
            type="file"
            accept="image/png"
            onChange={subirImgStorage}
          ></input>
          {estadoImg == true && <p>⚠️ Seleccione una imagen</p>}
        </div>
        <form className="entradas" onSubmit={handleSubmit(insertar)}>
          <ContainerInput>
            <div className="subcontainer">
              <h4>Descripción: </h4>
              <Input
                placeholder="Ingrese una descripción"
                type="text"
                {...register("descripcion", { required: true, maxLength: 20 })}
              />
            </div>
            {errors.descripcion?.type === "required" && (
              <p>❌ Ingrese una descripción</p>
            )}
            {errors.descripcion?.type === "maxLength" && (
              <p>⚠️ Solo se aceptan 20 caracteres</p>
            )}
          </ContainerInput>
          <ContainerInput>
            <div className="subcontainer">
              <h4>Precio: </h4>
              <Input
                placeholder="Ingrese un precio"
                type="number"
                step="0.01"
                {...register("precio", { required: true, valueAsNumber: true })}
              />
            </div>
            {errors.precio?.type === "required" && (
              <p>❌ Ingrese un precio válido</p>
            )}
            {errors.precio?.type === "valueAsNumber" && (
              <p>❌ El valor ingresado no es un número</p>
            )}
          </ContainerInput>
          <div className="footerContent">
            <BtnOperaciones titulo=" Enviar" icono={<FiSend />} />
          </div>
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .sub-contenedor {
    width: 80%;
    background-color: #e7ebf0;
    border-radius: 10px;
    padding: 10px 20px;
    margin: 0px 20px;
    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
    }
    .pictureContainer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      flex-direction: column;
      img {
        width: 100px;
        object-fit: cover;
      }
      input {
        display: none;
      }
    }
    .entradas {
      .footerContent {
        display: flex;
        align-items: center;
        height: 100%;
        gap: 20px;
        margin-top: 20px;
        justify-content: center;
      }
    }
  }
`;

const ContainerInput = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  .subcontainer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
`;

const Input = styled.input`
  border: 2px solid #e8e8e8;
  padding: 15px;
  border-radius: 10px;
  background-color: #212121;
  font-size: small;
  font-weight: bold;
  text-align: center;
  color: white;
  text-align: start;
  width: 70%;
  &:focus {
    outline-color: white;
    background-color: #212121;
    color: #e8e8e8;
    box-shadow: 5px 5px #888888;
  }
`;
