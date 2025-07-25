// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

import ProtectedRoute from "@/redux/ProtectedRoute";

// export default function UserDashboardPage() {
//   const [domainInput, setDomainInput] = useState('');
//   const [domains, setDomains]: any = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sendingEmail, setSendingEmail] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) router.push('/login');
//     else fetchDomains(token);
//   }, []);

//   const fetchDomains = async (token: any) => {
//     const res = await fetch('/api/user-domains', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     if (Array.isArray(data)) setDomains(data);
//   };

//   const handleAddDomain = async () => {
//     const token = localStorage.getItem('token');
//     if (!domainInput || !token) return;
//     setLoading(true);
//     const res = await fetch('/api/check-ssl', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ domain: domainInput }),
//     });
//     const newData = await res.json();
//     setDomains([...domains, newData]);
//     setDomainInput('');
//     setLoading(false);
//   };

//   const handleSendEmail = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;
//     setSendingEmail(true);
//     const res = await fetch('/api/send-alerts', {
//       method: 'POST',
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     alert(data.message || data.error);
//     setSendingEmail(false);
//   };

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-xl font-bold mb-4">Dashboard</h1>
//       <div className="flex gap-2 mb-6">
//         <input
//           value={domainInput}
//           onChange={(e) => setDomainInput(e.target.value)}
//           placeholder="Enter domain"
//           className="border px-3 py-2 w-full rounded"
//         />
//         <button onClick={handleAddDomain} className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
//           {loading ? 'Checking...' : 'Add Domain'}
//         </button>
//         <button
//           onClick={handleSendEmail}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//           disabled={sendingEmail}
//         >
//           {sendingEmail ? 'Sending...' : 'Send Email'}
//         </button>
//       </div>
//       <table className="w-full border text-sm">
//         <thead className="bg-blue-500 text-white">
//           <tr>
//             <th className="px-2 py-2">Domain</th>
//             <th>Issue</th>
//             <th>Expiry</th>
//             <th>Days Left</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {domains.map((d: any, i: any) => (
//             <tr key={i} className="border-t">
//               <td className="px-2 py-1">{d.domain}</td>
//               <td>{d.issueDate}</td>
//               <td>{d.expiryDate}</td>
//               <td>{d.daysLeft}</td>
//               <td className={
//                 d.status === 'OK'
//                   ? 'text-green-600'
//                   : d.status === 'Expiring soon'
//                   ? 'text-yellow-600'
//                   : 'text-red-600'
//               }>
//                 {d.status}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }



export default function UserDashboard() {
  return (
    <ProtectedRoute>
      <div>User dashboard content here</div>
    </ProtectedRoute>
  );
}
