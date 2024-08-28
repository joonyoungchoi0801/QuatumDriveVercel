import create from 'zustand';

interface SidebarStore {
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
  sidebarWidth: 220,
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
}));

export default useSidebarStore;
