
import API from "./api";

const AuthService = {
  login: async (credentials) => {
    const response = await API.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
      role: credentials.role,
    });

    return response.data;
  },

  refreshToken: async () => {
    const response = await API.post("/auth/refresh-token");
    return response.data;
  },

  logout: async () => {
    const response = await API.post("/auth/logout");
    return response.data;
  },

  employeeRegistration: async (employee) => {
    const formData = new FormData();

    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('mobileNumber', employee.mobileNumber);
    formData.append('role', employee.role);
    formData.append('password', employee.password);

    if (employee.gender) {
      formData.append('gender', employee.gender);
    }

    if (employee.profile instanceof File && employee.profile.size > 0) {
      formData.append('profile', employee.profile);
    }

    const response = await API.post('/auth/emp-register', formData);

    return response.data;
  },

  getAllEmployees: async (params = {}) => {
    const response = await API.get('/auth/getAllEmployee', {
      params,
    });
    return response.data;
  },


  editEmployee: async (id, employeeData) => {
    const formData = new FormData();

    Object.entries(employeeData).forEach(([key, value]) => {
      if (key === 'profile') {
        if (value instanceof File && value.size > 0) {
          formData.append('profile', value);
        }
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await API.patch(
      `/auth/editUser/${id}`,
      formData
    );

    return response.data;
  },

  changeEmployeeActiveStatus: async (id) => {
    const response = await API.patch(
      `/auth/changeActiveStatus/${id}`
    );

    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await API.delete(`/auth/deleteUser/${id}`);
    return response.data;
  },


};



export default AuthService;
