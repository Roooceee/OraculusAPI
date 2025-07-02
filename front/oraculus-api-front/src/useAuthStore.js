import { create } from 'zustand';

const useAuthStore = create((set) => ({

  isConnected: false,
  user: null,
  isLoading: true,
  expiresAt : null,

  // Connexion
  login: async (identifiant, password) => {

    const email = identifiant;
    const pseudo = identifiant;

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pseudo, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Connexion réussie:', data);
        set({ user: data.user, isConnected: true 
          , expiresAt : new Date(data.expiresAt) 
        });
        return { success: true };
      } else {
        console.log('❌ Erreur connexion:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.log('❌ Erreur réseau:', error);
      return { success: false, error: 'Erreur réseau' };
    }
  },

  // Check session
  checkSession: async () => {

    set({ isLoading: true });

    try {
      const res = await fetch('http://localhost:3000/api/checkSession', {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.loggedIn) {
        console.log('✅ Session active:', data.user);
        set({ isConnected: true, user: data.user , expiresAt : new Date(data.expiresAt) });
      } else {
        console.log('ℹ️ Pas de session');
        set({ isConnected: false, user: null });
      }
    } catch (error) {
      console.log('❌ Erreur checkSession:', error);
      set({ isConnected: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  // Permet de rester connecter
  stayConnected: async () => {
  try {
    const res = await fetch('http://localhost:3000/api/stayConnect', {
      credentials: 'include',
    });
    const data = await res.json();

    if (res.ok) {
      console.log('✅ Session prolongée');
      return { success: true };
    } else {
      console.log('❌ Session expirée');
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log('❌ Erreur réseau:', error);
    return { success: false, error: 'Erreur réseau' };
  }
},

  // Déconnexion
  logout: async () => {
    try {
      await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      set({ isConnected: false, user: null });
      console.log('✅ Déconnecté');
    } catch (error) {
      console.log('❌ Erreur logout:', error);
    }
    set({ isConnected: false, user: null });
  },

}));


export default useAuthStore