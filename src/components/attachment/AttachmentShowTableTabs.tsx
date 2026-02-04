import { colors } from "../../utilities/color";

type Props = {
  //for tab 0
  tab0Title: string;
  //for tab 1
  tab1Title: string;
  //for tab 2
  tab2Title: string;
  //for tab 3
  tab3Title?: string;
  //for tab 4
  tab4Title?: string;
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
};

const AttachmentShowTableTabs = ({
  tab0Title,
  tab1Title,
  tab2Title,
  tab3Title,
  tab4Title,
  activeTab,
  setActiveTab,
}: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex w-full mt-2 text-sm items-center justify-center text-gray-500">
        <div
          className="w-1/3 border border-gray-300 rounded-t-2xl p-2 mx-2 text-center cursor-pointer"
          style={{
            boxShadow:
              activeTab === 0 ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none",
            backgroundColor: activeTab === 0 ? colors.slate200 : colors.gray200,
            fontWeight: activeTab === 0 ? "bold" : "normal",
          }}
          onClick={() => setActiveTab(0)}
        >
          <div className="flex items-center justify-center">
            <p>{tab0Title}</p>
          </div>
        </div>
        <div
          className="w-1/3 border border-gray-300 rounded-t-2xl p-2 mx-2 text-center cursor-pointer"
          style={{
            boxShadow:
              activeTab === 1 ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none",
            backgroundColor: activeTab === 1 ? colors.slate200 : colors.gray200,
            fontWeight: activeTab === 1 ? "bold" : "normal",
          }}
          onClick={() => setActiveTab(1)}
        >
          <div className="flex items-center justify-center">
            <p>{tab1Title}</p>
          </div>
        </div>
        <div
          className="w-1/3 border border-gray-300 rounded-t-2xl p-2 mx-2 text-center cursor-pointer"
          style={{
            boxShadow:
              activeTab === 2 ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none",
            backgroundColor: activeTab === 2 ? colors.slate200 : colors.gray200,
            fontWeight: activeTab === 2 ? "bold" : "normal",
          }}
          onClick={() => setActiveTab(2)}
        >
          <div className="flex items-center justify-center">
            <p>{tab2Title}</p>
          </div>
        </div>
        {tab3Title && (
          <div
            className="w-1/3 border border-gray-300 rounded-t-2xl p-2 mx-2 text-center cursor-pointer"
            style={{
              boxShadow: activeTab === 3 ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none",
              backgroundColor: activeTab === 3 ? colors.slate200 : colors.gray200,
              fontWeight: activeTab === 3 ? "bold" : "normal",
            }}
            onClick={() => setActiveTab(3)}
          >
            <div className="flex items-center justify-center">
              <p>{tab3Title}</p>
            </div>
          </div>
        )}
        {tab4Title && (
          <div
            className="w-1/3 border border-gray-300 rounded-t-2xl p-2 mx-2 text-center cursor-pointer"
            style={{
              boxShadow: activeTab === 4 ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none",
              backgroundColor: activeTab === 4 ? colors.slate200 : colors.gray200,
              fontWeight: activeTab === 4 ? "bold" : "normal",
            }}
            onClick={() => setActiveTab(4)}
          >
            <div className="flex items-center justify-center">
              <p>{tab4Title}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentShowTableTabs;
