// Example: How to use Laravel API in React components

import { useEffect, useState } from 'react';
import { productsAPI, transactionsAPI, authAPI } from './lib/api';

// Example 1: Fetch Products
function ProductsExample() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await productsAPI.getAll({
          category: 'game',
          search: 'mobile legends'
        });
        
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map((product: any) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Rp {product.sell_price.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

// Example 2: Create Transaction
function OrderExample() {
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    setLoading(true);
    
    try {
      const response = await transactionsAPI.create({
        product_id: 1,
        target_account: '1234567890',
        server_id: '1234',
        payment_method: 'qris',
        promo_code: 'TOPUP10'
      });

      console.log('Transaction created:', response.data);
      alert(`Order berhasil! ID: ${response.data.transaction_id}`);
      
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      alert(error.response?.data?.message || 'Gagal membuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleOrder} disabled={loading}>
      {loading ? 'Processing...' : 'Buat Pesanan'}
    </button>
  );
}

// Example 3: Login
function LoginExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await authAPI.login(email, password);
      console.log('Login success:', response);
      
      // Redirect to dashboard or home
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

// Example 4: Using React Query (recommended)
import { useQuery, useMutation } from '@tanstack/react-query';

function ProductsWithReactQuery() {
  // Fetch products
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 'game'],
    queryFn: () => productsAPI.getByCategory('game'),
  });

  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: transactionsAPI.create,
    onSuccess: (data) => {
      alert(`Order berhasil! ID: ${data.data.transaction_id}`);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Gagal membuat pesanan');
    },
  });

  const handleOrder = () => {
    createTransaction.mutate({
      product_id: 1,
      target_account: '1234567890',
      payment_method: 'qris',
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      <h2>Products</h2>
      {data?.data.map((product: any) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Rp {product.sell_price.toLocaleString()}</p>
          <button onClick={handleOrder}>Order</button>
        </div>
      ))}
    </div>
  );
}

export { ProductsExample, OrderExample, LoginExample, ProductsWithReactQuery };
