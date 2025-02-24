import {UserType} from '../types';

export const loginApi = ({
  data,
}: {
  data: {email: string; password: string};
}): Promise<any> => {
  // return request({
  //   data: data,
  //   method: 'post',
  //   endpoint: `/teachers/signin`,
  //   // log: true,
  // });

  // Hardcode mock credentials (e.g., user@example.com and password123) and validate them.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        data.email === 'user@example.com' &&
        data.password === 'password123'
      ) {
        resolve({
          status: 200,
          data: {
            accessToken: '1234567890',
            user: {
              email: data.email,
              name: 'test name',
              password: data.password,
            },
          },
        });
      }
      reject({
        status: 400,
        data: {
          error: 'Invalid credentials',
        },
      });
    }, 1000);
  });
};

export const updateProfileApi = ({data}: {data: UserType}): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: {
          user: {
            name: data.name,
            ...data,
          },
        },
      });

      reject({
        status: 400,
        data: {
          error: 'Invalid User',
        },
      });
    }, 1000);
  });
};
