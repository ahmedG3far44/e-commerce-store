const BASE_URL = import.meta.env.VITE_BASE_URL;

interface loginUserParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: loginUserParams) => {
  try {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("your email or password is wrong!!");
    }
    const data = await response.json();

    if (!data) {
      throw new Error("can't get user data");
    }
    const { user, token } = data;

    return { username: user.email, token };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

interface RegisterUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterUserParams) => {
  try {
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    if (!response.ok) {
      throw new Error("register user failed!!");
    }
    const data = await response.json();
    const { user, token } = data;

    return { username: user.email, token };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const logout = async () => {
  window.localStorage.clear();
  return;
};

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/product`);
    if (!response.ok) {
      throw new Error("can't get a product please check your connection!!");
    }
    const products = await response.json();
    // console.log(products);
    return products;
  } catch (err) {
    console.error(err);
    // alert(err);
    return err;
  }
};

export const getUserCartItem = async ({ token }: { token: string }) => {
  try {
    
    if (!token) return;

    const response = await fetch(`${BASE_URL}/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("can't cart of user please check your connection!!");
    }
    const userCart = await response.json();
    // console.log(products);
    return userCart;
  } catch (err) {
    console.error(err);
    // alert(err);
    return err;
  }
};
