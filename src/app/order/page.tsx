// app/order/page.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  Blocks,
  Keyboard,
} from "lucide-react";

export default function OrderBranch() {
  const router = useRouter();

  return (
    <>
    <main className='flex bg-white w-full justify-center px-20 py-5'>
      <div className="bg-white m-10 max-w-md" onClick={() => router.push("/inventory/order/")}>
        <h2 className="text-3xl">在庫品発注登録フォーム</h2>
        <div className="flex justify-center"><Blocks size={100} /></div>
      </div>
      <div className="bg-white p-10 max-w-md" onClick={() => router.push("/asset/order/")}>
        <h2 className="text-3xl">設備品発注登録フォーム</h2>
        <div className="flex justify-center"><Keyboard size={100} /></div>
      </div>
    </main>
    </>
  );
}
