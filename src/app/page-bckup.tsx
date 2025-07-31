'use client';
import { useState } from 'react';

export default function Home() {
  const [domainInput, setDomainInput] = useState('');
  const [domains, setDomains]: any = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSSL = async (domain: any) => {
    try {
      const res = await fetch(`/api/check-ssl?domain=${domain}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const daysLeft = Math.floor((new Date(data.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const status = daysLeft <= 0 ? 'Expired' : daysLeft <= 7 ? 'Expiring soon' : 'OK';

      return { ...data, daysLeft, status };
    } catch (err: any) {
      return { domain, error: err.message };
    }
  };

  const handleAddDomain = async () => {
    if (!domainInput) return;
    setLoading(true);
    const result = await fetchSSL(domainInput);
    setDomains([...domains, result]);
    setDomainInput('');
    setLoading(false);
  };

  const handleDelete = (domain: any) => {
    setDomains(domains.filter((d: any) => d.domain !== domain));
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SSL Monitoring Tool</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter domain"
          className="border px-3 py-2 w-full rounded"
          value={domainInput}
          onChange={(e) => setDomainInput(e.target.value)}
        />
        <button
          onClick={handleAddDomain}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Add Domain'}
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-2 py-2">Domain</th>
            <th>Issue Date</th>
            <th>Expiry Date</th>
            <th>Days Left</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {domains.map((d: any, i: any) => (
            <tr key={i} className="border-t">
              <td className="px-2 py-1">{d.domain}</td>
              <td>{d.issueDate || '-'}</td>
              <td>{d.expiryDate || '-'}</td>
              <td>{d.daysLeft ?? '-'}</td>
              <td className={
                d.status === 'OK'
                  ? 'text-green-600'
                  : d.status === 'Expiring soon'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }>
                {d.status || d.error || 'Unknown'}
              </td>
              <td>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(d.domain)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
