import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ContactForm from './components/ContactForm';
import LoginForm from './components/LoginForm';
import AddProductForm from './components/AddProductForm';
import { API_URL, apiFetch } from './api.js';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Пользователь читается из localStorage один раз при первом рендере
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user') || 'null')
  );

  // Загрузка каталога
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error('Ошибка сервера: ' + response.status);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить товары. Проверьте, запущен ли сервер.');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // При открытии страницы спрашиваем сервер, действителен ли сохранённый токен
  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    apiFetch('/auth/me')
      .then(setUser)
      .catch(() => {}); // при 401 apiFetch сам выполнит выход
  }, []);

  function handleLogin(user, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  function handleAddToCart() {
    setCartCount(cartCount + 1);
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header cartCount={cartCount} />

      <div className="auth-bar">
        {user ? (
          <>
            <span>Вы вошли как <b>{user.name}</b> ({user.role})</span>
            <button onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </div>

      <main className="page">
        <section id="catalog" className="catalog">
          {user?.role === 'admin' && (
            <AddProductForm onAdded={(p) => setProducts([...products, p])} />
          )}

          <div className="catalog-toolbar">
            <h2>Каталог</h2>
            <input
              type="search"
              placeholder="Поиск товара..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <p>Загрузка...</p>}
          {error && <p className="error">{error}</p>}

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAddToCart}
                featured={product.id === 1}
              />
            ))}
          </div>
        </section>

        <aside id="delivery" className="sidebar">
          <h3>Доставка</h3>
          <ul>
            <li>Астана — на следующий день</li>
            <li>Акмолинская область — 2–3 дня</li>
            <li>Бесплатно от 20 000 тг</li>
          </ul>
        </aside>

        <ContactForm />
      </main>

      <Footer />
    </>
  );
}

export default App;