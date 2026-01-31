const BASE_URL = "http://localhost:9000/api/cart";

export const getCart = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const addCartItem = async (data: {
  product: string;
  quantity: number;
}) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
