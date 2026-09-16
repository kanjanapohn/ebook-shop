"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      // เมื่อกดค้นหา จะพาไปยังหน้า Order Status ตาม ID ที่กรอก
      router.push(`/order/${orderId.trim()}`);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-slate-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full relative">
        <Link href="/" className="absolute top-6 left-6 text-slate-400 hover:text-indigo-600 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </Link>
        
        <div className="text-center mb-6 mt-4">
          <div className="inline-block bg-indigo-100 p-3 rounded-full mb-3">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">ติดตามคำสั่งซื้อ</h1>
          <p className="text-slate-500 text-sm mt-2">กรุณากรอกรหัสคำสั่งซื้อ (Order ID) ของคุณ</p>
        </div>
        
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <input 
              type="text" 
              required 
              placeholder="เช่น 3f8b... (ดูได้จากตอนสั่งซื้อ)"
              className="w-full border border-slate-300 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center font-mono text-sm"
              value={orderId} 
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl hover:bg-indigo-600 transition-all duration-200 font-bold shadow-md"
          >
            ค้นหาคำสั่งซื้อ
          </button>
        </form>
      </div>
    </main>
  );
}