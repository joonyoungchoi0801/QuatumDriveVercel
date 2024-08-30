import create from 'zustand';

interface ProfileStore {
  phonenum: string;
  setPhonenum: (phonenum: string) => void;
  username: string;
  setUsername: (username: string) => void;
  profilePath: string | null;
  setProfilePath: (profilePath: string | null) => void;
  email: string;
  setEmail: (email: string) => void;
  usedVolume: number;
  setUsedVolume: (usedVolume: number) => void;
  maxVolume: number;
  setMaxVolume: (maxVolume: number) => void;
}

const useProfileStore = create<ProfileStore>((set) => ({
  phonenum: '',
  setPhonenum: (phonenum) => set({ phonenum }),
  username: '',
  setUsername: (username) => set({ username }),
  profilePath: null,
  setProfilePath: (profilePath) => set({ profilePath }),
  email: '',
  setEmail: (email) => set({ email }),
  usedVolume: 0,
  setUsedVolume: (usedVolume) => set({ usedVolume }),
  maxVolume: 0,
  setMaxVolume: (maxVolume) => set({ maxVolume }),
}));

export default useProfileStore;
