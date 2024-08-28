import create from 'zustand';

interface AccessTokenStore {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
}

const useAccessTokenStore = create<AccessTokenStore>((set) => ({
  accessToken: '',
  setAccessToken: (accessToken) => set({ accessToken }),
}));

export default useAccessTokenStore;
