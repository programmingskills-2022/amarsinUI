import { useEffect, useState } from "react";
import PageTitle from "../layout/PageTitle";
import ExcelExport from "../../utilities/ExcelExport";
import Add32 from "../../assets/images/GrayThem/add32.png";
//import Add24Disabled from "../../assets/images/GrayThem/add24_disabled.png";
import Refresh32 from "../../assets/images/GrayThem/rfrsh32.png";
import Del24 from "../../assets/images/GrayThem/del24.png";
import Del24Disabled from "../../assets/images/GrayThem/del_disabled24.png";
import Edit24 from "../../assets/images/GrayThem/edit24.png";
import Edit24Disabled from "../../assets/images/GrayThem/edit24_disabled.png";
import Accept24 from "../../assets/images/GrayThem/accept24.png";
import Accept24Disabled from "../../assets/images/GrayThem/accept24_disabled.png";
import Accept from "../../assets/images/GrayThem/img24_3.png";
import { useGeneralContext } from "../../context/GeneralContext";
import TTable from "../controls/TTable";
import { useProductOfferStore } from "../../store/productOfferStore";
import { useProductOffer } from "../../hooks/useProductOffer";
import {
  convertPersianDate,
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import ModalMessage from "../layout/ModalMessage";
import Skeleton from "../layout/Skeleton";
import ProductOfferParams from "./ProductOfferParams";
import ModalForm from "../layout/ModalForm";
import ProductOfferForm from "./ProductOfferForm";
import { ProductOfferDtlTable } from "../../types/productOffer";

const ProductOffer = () => {
  const [data, setData] = useState<any[]>([]);
  const [dataDtl, setDataDtl] = useState<ProductOfferDtlTable[]>([]);
  const columns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "5%",
    },
    {
      Header: "شناسه",
      accessor: "id",
      width: "5%",
    },
    {
      Header: "تاریخ",
      accessor: "dat",
      width: "7%",
    },
    {
      Header: "ساعت",
      accessor: "tim",
      width: "5%",
    },
    {
      Header: "توضیح",
      accessor: "dsc",
      width: "40%",
    },
    {
      Header: "تایید",
      accessor: "accepted",
      width: "3%",
    },
    {
      Header: "کاربر",
      accessor: "usrName",
      width: "15%",
    },
    {
      Header: "مرحله",
      accessor: "flowMapName",
      width: "20%",
    },
  ];
  const columnsDtl = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "5%",
    },
    {
      Header: "برند",
      accessor: "bName",
      width: "10%",
    },
    {
      Header: "کالا",
      accessor: "product",
      width: "40%",
    },
    {
      Header: "پ 1",
      accessor: "s1O",
      width: "5%",
    },
    {
      Header: "پ 2",
      accessor: "s2O",
      width: "5%",
    },
    {
      Header: "پ 3",
      accessor: "s3O",
      width: "5%",
    },
    {
      Header: "پ 4",
      accessor: "s4O",
      width: "5%",
    },
    {
      Header: "بدون آفر",
      accessor: "no",
      width: "5%",
    },
    {
      Header: "توضیح",
      accessor: "dtlDsc",
      width: "20%",
    },
  ];

  const { setField } = useProductOfferStore();
  const {
    productOffer,
    productOfferDtl,
    productOfferMeta,
    isLoading,
    isLoadingDtl,
    refetch,
    addProductList,
    productOfferDtlHistory,
    isLoadingProductOfferDtlHistory,
    productOfferSave,
    isLoadingProductOfferSave,
  } = useProductOffer();
  const { yearId, systemId } = useGeneralContext();
  const [selectedId, setSelectedId] = useState<number>(1363);
  const [isNew, setIsNew] = useState<boolean>(false);
  //for ProductOfferParams params
  const [regFDate, setRegFDate] = useState<Date | null>(null);
  const [regTDate, setRegTDate] = useState<Date | null>(null);
  const [fDate, setFDate] = useState<Date | null>(null);
  const [tDate, setTDate] = useState<Date | null>(null);
  const [state, setState] = useState<number>(0);

  useEffect(() => {
    setField("acc_Year", yearId);
    setField("acc_System", systemId);
    setField("state", state);

    setField(
      "regFDate",
      regFDate === null || !regFDate
        ? ""
        : convertPersianDate(regFDate.toLocaleDateString("fa-IR"))
    );
    setField(
      "regTDate",
      regTDate === null || !regTDate
        ? ""
        : convertPersianDate(regTDate.toLocaleDateString("fa-IR"))
    );
    setField(
      "fDate",
      fDate === null || !fDate
        ? ""
        : convertPersianDate(fDate.toLocaleDateString("fa-IR"))
    );
    setField(
      "tDate",
      tDate === null || !tDate
        ? ""
        : convertPersianDate(tDate.toLocaleDateString("fa-IR"))
    );
  }, [yearId, systemId, state, regFDate, regTDate, fDate, tDate]);

  useEffect(() => {
    //console.log("selectedId", selectedId);
    setField("id", selectedId);
  }, [selectedId]);

  useEffect(() => {
    const tempData = productOffer?.map((item, index) => {
      return {
        ...item,
        id: convertToFarsiDigits(item.id),
        dat: convertToFarsiDigits(item.dat),
        tim: convertToFarsiDigits(item.tim),
        dsc: convertToFarsiDigits(item.dsc),
        accepted: item.accepted ? (
          <img src={Accept} alt="Accept" className="w-4 h-4" />
        ) : null,
        usrName: convertToFarsiDigits(item.usrName),
        flowMapName: convertToFarsiDigits(item.flowMapName),
        index: convertToFarsiDigits(index + 1),
      };
    });

    setData(tempData || []);
    if (tempData?.[0]?.id) {
      setSelectedId(Number(convertToLatinDigits(tempData?.[0]?.id)));
    } else {
      setSelectedId(0);
    }
  }, [productOffer]);

  useEffect(() => {
    let tempDataDtl: ProductOfferDtlTable[] = [];
    if (productOfferDtl) {
      tempDataDtl = productOfferDtl.map((item, index) => {
        return {
          index: convertToFarsiDigits(index + 1),
          id: item.id,
          bName: convertToFarsiDigits(item.bName),
          pId: item.pId,
          product: convertToFarsiDigits(item.product),
          lastDate: convertToFarsiDigits(item.lastDate),
          s1O: item.s1N + item.s1D < 0 ? "" : convertToFarsiDigits(item.s1D.toString() + "+" + item.s1N.toString()),
          s2O: item.s2N + item.s2D < 0 ? "" : convertToFarsiDigits(item.s2D.toString() + "+" + item.s2N.toString()),
          s3O: item.s3N + item.s3D < 0 ? "" : convertToFarsiDigits(item.s3D.toString() + "+" + item.s3N.toString()),
          s4O: item.s4N + item.s4D < 0 ? "" : convertToFarsiDigits(item.s4D.toString() + "+" + item.s4N.toString()),
          s1N: "",
          s1D: "",
          s2N: "",
          s2D: "",
          s3N: "",
          s3D: "",
          s4N: "",
          s4D: "",
          no: item.no ? (
            <img src={Accept} alt="Accept" className="w-4 h-4" />
          ) : null,
          dtlDsc: convertToFarsiDigits(item.dtlDsc),
        };
      });
      if (tempDataDtl) {
        setDataDtl(tempDataDtl);
      }
    }
  }, [productOfferDtl]);

  const handleSelectedIdChange = (id: number) => {
    //console.log(id, "id in WorkflowForm");
    setSelectedId(id);
  };

  const { isModalOpen, setIsModalOpen } = useGeneralContext();
  useEffect(() => {
    let timeoutId: number;
    if (isModalOpen) {
      timeoutId = setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpen]);

  return (
    <div
      className={`sm:h-full overflow-y-scroll flex flex-col bg-gray-200 pt-2 gap-2`}
    >
      {/* Top header */}
      <header className="flex items-center justify-between border-gray-300 border-b pb-2">
        <PageTitle />
        <div className="flex px-4 items-center gap-4">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setIsNew(true)}
          >
            <img src={Add32} alt="Add32" className="w-6 h-6" />
            <p className="text-xs">جدید</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <img
              src={data?.length > 0 ? Del24 : Del24Disabled}
              alt="Del24"
              className="w-6 h-6"
            />
            <p className="text-xs">حذف</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <img
              src={data?.length > 0 ? Edit24 : Edit24Disabled}
              alt="Edit24"
              className="w-6 h-6"
            />
            <p className="text-xs">ویرایش</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <img
              src={data?.length > 0 ? Accept24 : Accept24Disabled}
              alt="Accept24"
              className="w-6 h-6"
            />
            <p className="text-xs">تایید</p>
          </div>

          <ExcelExport data={data} headCells={columns} />

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => refetch()}
          >
            <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
            <p className="text-xs">بازخوانی</p>
          </div>
        </div>
      </header>
      <div className="flex gap-2 px-2 h-1/2">
        <div className="w-3/4 overflow-y-scroll bg-white rounded-md">
          {isLoading ? (
            <Skeleton />
          ) : (
            <TTable
              columns={columns}
              data={data}
              fontSize="0.75rem"
              changeRowSelectColor={true}
              setSelectedId={handleSelectedIdChange}
              wordWrap={false}
              showToolTip={true}
            />
          )}
        </div>
        {/* ProductOfferParams */}
        <div className="w-1/4 h-full">
          <ProductOfferParams
            regFDate={regFDate}
            setRegFDate={setRegFDate}
            regTDate={regTDate}
            setRegTDate={setRegTDate}
            fDate={fDate}
            setFDate={setFDate}
            tDate={tDate}
            setTDate={setTDate}
            setState={setState}
          />
        </div>
      </div>

      <div className="px-2 h-full">
        {isLoadingDtl ? (
          <Skeleton />
        ) : (
          <TTable
            columns={columnsDtl}
            data={dataDtl}
            fontSize="0.75rem"
            changeRowSelectColor={true}
            wordWrap={false}
            showToolTip={true}
          />
        )}
      </div>
      <ModalMessage
        isOpen={isModalOpen}
        backgroundColor="bg-red-200"
        bgColorButton="bg-red-500"
        bgColorButtonHover="bg-red-600"
        color="text-white"
        onClose={() => setIsModalOpen(false)}
        message={productOfferMeta?.message || ""}
      />
      <ModalForm
        isOpen={isNew}
        onClose={() => setIsNew(false)}
        title="آفرهای کالا"
        width="5/6"
      >
        <ProductOfferForm
          addProductList={addProductList}
          productOfferDtlHistory={productOfferDtlHistory || []}
          isLoadingProductOfferDtlHistory={isLoadingProductOfferDtlHistory}
          productOfferSave={productOfferSave}
          isLoadingProductOfferSave={isLoadingProductOfferSave}
        />
      </ModalForm>
    </div>
  );
};

export default ProductOffer;
