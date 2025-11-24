import { useState } from 'react';
import axios from 'axios';

export function TestConnection() {
  const [result, setResult] = useState('');

  const testBackend = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000');
      setResult('✅ Backend connected: ' + JSON.stringify(response.data));
    } catch (error) {
      setResult('❌ Backend error: ' + error.message);
    }
  };

  return (
    <div className="p-4 border rounded">
      <button onClick={testBackend} className="bg-blue-500 text-white px-4 py-2 rounded">
        Test Backend Connection
      </button>
      {result && <p className="mt-2">{result}</p>}
    </div>
  );
}