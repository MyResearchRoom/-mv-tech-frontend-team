import API from "./api";

const GSTService = {
  fetchGSTDetails: async (gstin) => {
    const response = await API.post("/gst/fetch-details", {
      gstin,
    });

    return response.data;
  },
};

export default GSTService;
