import RotateRight from "../../assets/images/GrayThem/rotate-right24.png";
import RotateLeft from "../../assets/images/GrayThem/rotate-left24.png";
import Prev from "../../assets/images/GrayThem/Prev24.png";
import PrevDisabled from "../../assets/images/GrayThem/prev_disabled24.png";
import Next from "../../assets/images/GrayThem/next24.png";
import NextDisabled from "../../assets/images/GrayThem/next_disabled24.png";
import Attach from "../../assets/images/GrayThem/Attach24.png";
import { useEffect, useState } from "react";
import { PaymentAttachmentResponse } from "../../types/cheque";
import Skeleton from "../layout/Skeleton";
import AttachmentImageLoader from "../../utilities/AttachmentImageLoader.tsx";
import { useAuthStore } from "../../store/authStore.ts";

type Props = {
  paymentAttachmentResponse: PaymentAttachmentResponse;
  isLoadingPaymentAttachment: boolean;
  setField: (field: string, value: any) => void;
};

const RegRecievedChequeImg = ({
  paymentAttachmentResponse,
  isLoadingPaymentAttachment,
  setField,
}: Props) => {
  const { authApiResponse } = useAuthStore();
  const token = authApiResponse?.data.result.login.token ?? "";

  const imageUrl = paymentAttachmentResponse?.data?.result?.path ?? "";

  const [actCode, setActCode] = useState("Last");
  const [curId, setCurId] = useState(0);
  const [rotation, setRotation] = useState(0); // Initial rotation angle is 0 degrees

  useEffect(() => {
    setField("actCode", actCode);
    setField("curId", curId);
    setField("includeBase64", false);
  }, [actCode, curId]);

  const handleNext = () => {
    if (paymentAttachmentResponse.data.result.hasNext) {
      setActCode("Next");
      setCurId(paymentAttachmentResponse.data.result.id);
    }
  };

  const handlePrev = () => {
    if (paymentAttachmentResponse.data.result.hasPrev) {
      setActCode("Prev");
      setCurId(paymentAttachmentResponse.data.result.id);
    }
  };

  // Function to handle rotation to the left (counter-clockwise)
  const handleRotateLeft = () => {
    if (paymentAttachmentResponse.data.result.path!==null) {
      setRotation((prevRotation) => (prevRotation - 90) % 360);
    }
  };

  const handleRotateRight = () => {
    if (paymentAttachmentResponse.data.result.path!==null) {
      setRotation((prevRotation) => (prevRotation + 90) % 360);
    }
  };

  return (
    <div className="flex md:w-1/2 h-full flex-col gap-2">
      <div className="flex w-full justify-start items-center">
        <label className="py-2">تصویر:</label>
        <div className="flex justify-between items-center gap-4">
          <img
            src={RotateLeft}
            alt="rotate-left"
            className={`${paymentAttachmentResponse?.data?.result?.path!==null ? "hover:cursor-pointer" : "hover:cursor-not-allowed"}`}
            onClick={handleRotateLeft}
          />
          <img
            src={RotateRight}
            alt="rotate-right"
            className={`${paymentAttachmentResponse?.data?.result?.path!==null ? "hover:cursor-pointer" : "hover:cursor-not-allowed"}`}
            onClick={handleRotateRight}
          />
          <img
            src={
              paymentAttachmentResponse?.data?.result?.hasNext
                ? Next
                : NextDisabled
            }
            alt="next-disabled"
            className={`${paymentAttachmentResponse?.data?.result?.hasNext ? "hover:cursor-pointer" : "hover:cursor-not-allowed"}`}
            onClick={handleNext}
          />
          <img
            src={
              paymentAttachmentResponse?.data?.result?.hasPrev
                ? Prev
                : PrevDisabled
            }
            alt="prev-disabled"
            className={`${paymentAttachmentResponse?.data?.result?.hasPrev ? "hover:cursor-pointer" : "hover:cursor-not-allowed"}`}
            onClick={handlePrev}
          />
          <img src={Attach} alt="attach" className="hover:cursor-pointer" />
        </div>
      </div>
      <div>
        {isLoadingPaymentAttachment ? (
          <Skeleton />
        ) : (
          imageUrl && (
            <div className="flex w-full h-full justify-center items-center overflow-y-auto">
              <AttachmentImageLoader
                authToken={token}
                imageUrl={imageUrl}
                options={{
                  className:
                    "attachment-image transition-transform duration-300 ease-in-out",
                  alt: "Cheque Image",
                  style: {
                    maxWidth: "100%",
                    height: "auto",
                    transform: `rotate(${rotation}deg)`, // rotation is here
                  },
                  onError: (error) =>
                    console.error("Image failed to load:", error),
                }}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RegRecievedChequeImg;
