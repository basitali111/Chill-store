import ProductItem from '@/components/products/ProductItem';
import { Rating } from '@/components/products/SearchRating';
import productServices from '@/lib/services/productService';
import Link from 'next/link';

const sortOrders = ['newest', 'lowest', 'highest', 'rating'];
const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

const ratings = [5, 4, 3, 2, 1];

export async function generateMetadata({
  searchParams: { q = 'all', category = 'all', price = 'all', rating = 'all' },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      title: `Search ${q !== 'all' ? q : ''}${
        category !== 'all' ? ` : Category ${category}` : ''
      }${price !== 'all' ? ` : Price ${price}` : ''}${
        rating !== 'all' ? ` : Rating ${rating}` : ''
      }`,
    };
  } else {
    return {
      title: 'Search Products',
    };
  }
}

export default async function SearchPage({
  searchParams: {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const categories = await productServices.getCategories();
  const categoriesWithImages = await productServices.getCategoriesWithImages();
  const { countProducts, products, pages } = await productServices.getByQuery({
    category,
    q,
    price,
    rating,
    page,
    sort,
  });

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      {/* Sidebar for Filters */}
      <div className="p-4">
        <div className="text-xl pt-3">Department</div>
        <div className="mt-3">
          <ul>
            <li>
              <Link
                className={`link link-hover ${
                  'all' === category ? 'link-primary' : ''
                }`}
                href={getFilterUrl({ c: 'all' })}
              >
                Any
              </Link>
            </li>
            {categories.map((c: string) => (
              <li key={c}>
                <Link
                  className={`link link-hover ${
                    c === category ? 'link-primary' : ''
                  }`}
                  href={getFilterUrl({ c })}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-6">Price</div>
          <ul className="mt-3">
            <li>
              <Link
                className={`link link-hover ${
                  'all' === price ? 'link-primary' : ''
                }`}
                href={getFilterUrl({ p: 'all' })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  href={getFilterUrl({ p: p.value })}
                  className={`link link-hover ${
                    p.value === price ? 'link-primary' : ''
                  }`}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-6">Customer Review</div>
          <ul className="mt-3">
            <li>
              <Link
                href={getFilterUrl({ r: 'all' })}
                className={`link link-hover ${
                  'all' === rating ? 'link-primary' : ''
                }`}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  href={getFilterUrl({ r: `${r}` })}
                  className={`link link-hover ${
                    `${r}` === rating ? 'link-primary' : ''
                  }`}
                >
                  <Rating caption={' & up'} value={r}></Rating>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="md:col-span-4 p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4">
          <div className="flex flex-wrap items-center mb-4 sm:mb-0">
            {products.length === 0 ? 'No' : countProducts} Results
            {q !== 'all' && q !== '' && ' : ' + q}
            {category !== 'all' && ' : ' + category}
            {price !== 'all' && ' : Price ' + price}
            {rating !== 'all' && ' : Rating ' + rating + ' & up'}
            &nbsp;
            {(q !== 'all' && q !== '') ||
            category !== 'all' ||
            rating !== 'all' ||
            price !== 'all' ? (
              <Link className="btn btn-sm btn-ghost mt-2 sm:mt-0" href="/search">
                Clear
              </Link>
            ) : null}
          </div>
          <div className="flex items-center">
            <span className="mr-2">Sort by:</span>
            <div className="flex space-x-2">
              {sortOrders.map((s) => (
                <Link
                  key={s}
                  className={`mx-1 link link-hover ${
                    sort == s ? 'link-primary font-bold' : ''
                  } `}
                  href={getFilterUrl({ s })}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductItem key={product.slug} product={product} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          {products.length > 0 &&
            Array.from(Array(pages).keys()).map((p) => (
              <Link
                key={p}
                className={`btn join-item ${
                  Number(page) === p + 1 ? 'btn-active' : ''
                } `}
                href={getFilterUrl({ pg: `${p + 1}` })}
              >
                {p + 1}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
