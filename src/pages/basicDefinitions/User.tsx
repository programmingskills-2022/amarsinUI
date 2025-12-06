import { useState } from "react";
import PageTitle from "../../components/layout/PageTitle";
import UserAccessibilities from "../../components/user/UserAccessibilities";
import UserHeader from "../../components/user/UserHeader";
import UserInfo from "../../components/user/UserInfo";
import { DefinitionInvironment } from "../../types/definitionInvironment";

type Props = {
  definitionInvironment: DefinitionInvironment;
};

export default function User({ definitionInvironment }: Props) {
  const [isNew, setIsNew] = useState(-1);
  const testData: any[] = [
    {
      parentId: null,
      username: "test1",
      title: "test",
      orgUnit: "test",
      status: 1,
      online: 1,
      id: 1,
      isOpenLevelClicked: false,
    },
    {
      parentId: null,
      username: "test2",
      title: "test",
      orgUnit: "test",
      status:1,
      online: 0,
      id: 2,
      isOpenLevelClicked: false,
    },
    {
      parentId: 1,
      username: "test11",
      title: "test",
      orgUnit: "test",
      status: 1,
      online: 0,
      id: 11,
      isOpenLevelClicked: false,
    },
    {
      parentId: 11,
      username: "test111",
      title: "test",
      orgUnit: "test",
      status: 0,
      online: 0,
      id: 111,
      isOpenLevelClicked: false,
    },
  ];
  return (
    <div className="h-[calc(100vh-72px)] overflow-y-auto flex flex-col bg-gray-200 pt-2">
      {/* Top blue header */}
      <header className="flex items-center justify-between border-b-2 border-gray-300">
        <PageTitle definitionInvironment={definitionInvironment} />
        <UserHeader isNewUser={isNew} setIsNewUser={setIsNew} users={testData} />
      </header>
      {/* Sub-header */}

      {/* Main content */}
      <main className="w-full flex items-start justify-between">
        <UserInfo testData={testData} />
        <UserAccessibilities />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between"></footer>
    </div>
  );
}
