import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listDocuments, deleteDocument } from '../api/client';
import { Document } from '../types';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await listDocuments();
        setDocuments(response);
      } catch (err) {
        setError('Failed to fetch documents.');
        toast.error('Failed to fetch documents.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      toast.success('Document deleted successfully.');
    } catch (err) {
      setError('Failed to delete document.');
      toast.error('Failed to delete document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Documents</h2>
          <p className="text-2xl font-bold">{documents.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Recent Uploads</h2>
          <p className="text-2xl font-bold">{documents.slice(0, 5).length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <button
            onClick={() => navigate('/upload')}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Upload Document
          </button>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">Recent Documents</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Uploaded At</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-4 py-2 border-b">{doc.name}</td>
                <td className="px-4 py-2 border-b">{new Date(doc.uploadedAt).toLocaleString()}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;