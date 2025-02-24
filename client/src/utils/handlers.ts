interface loginUserParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: loginUserParams) => {
  try {
    const response = await fetch(`http://localhost:4000/api/user/login`, {
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
    const response = await fetch(`http://localhost:4000/api/user/register`, {
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
