import React, { useState } from 'react';
import axios from 'axios';

interface ProfileFormProps {
  apiKey: string;
  setAnalysisResults: (results: any) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ apiKey, setAnalysisResults }) => {
  const [formData, setFormData] = useState({
    username: '',
    followers: '',
    bio: '',
    bioLink: '',
    profileImageUrl: '',
    recentPosts: ['', '', '', '', '']
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePostChange = (index: number, value: string) => {
    const updatedPosts = [...formData.recentPosts];
    updatedPosts[index] = value;
    setFormData(prev => ({
      ...prev,
      recentPosts: updatedPosts
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Filtra posts vazios
    const filteredPosts = formData.recentPosts.filter(post => post.trim() !== '');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${API_URL}/api/instagram/analyze`, {
        apiKey,
        profileData: {
          username: formData.username,
          followers: parseInt(formData.followers) || 0,
          bio: formData.bio,
          bioLink: formData.bioLink || undefined,
          profileImageUrl: formData.profileImageUrl || undefined,
          recentPosts: filteredPosts.length > 0 ? filteredPosts : undefined
        }
      });

      if (response.data.success) {
        setAnalysisResults(response.data.data);
      } else {
        setError('Erro ao analisar o perfil.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao analisar o perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Dados do Perfil do Instagram</h2>
      <p className="mb-4 text-gray-600">
        Preencha os dados do perfil do Instagram que você deseja analisar.
        Os campos marcados com * são obrigatórios.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-1">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nome de usuário (username) *
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                @
              </span>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="username"
                required
              />
            </div>
          </div>
          
          <div className="col-span-1">
            <label htmlFor="followers" className="block text-sm font-medium text-gray-700 mb-1">
              Número de seguidores *
            </label>
            <input
              type="number"
              id="followers"
              name="followers"
              value={formData.followers}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="1000"
              required
            />
          </div>
          
          <div className="col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Texto da biografia (bio) *
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Digite o texto da bio do perfil"
              required
            />
          </div>
          
          <div className="col-span-2">
            <label htmlFor="bioLink" className="block text-sm font-medium text-gray-700 mb-1">
              Link principal da bio (opcional)
            </label>
            <input
              type="url"
              id="bioLink"
              name="bioLink"
              value={formData.bioLink}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://exemplo.com"
            />
          </div>
          
          <div className="col-span-2">
            <label htmlFor="profileImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL da imagem de perfil (opcional)
            </label>
            <input
              type="url"
              id="profileImageUrl"
              name="profileImageUrl"
              value={formData.profileImageUrl}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Links de posts recentes (opcional, até 5)
            </label>
            {formData.recentPosts.map((post, index) => (
              <div key={index} className="mb-2">
                <input
                  type="url"
                  value={post}
                  onChange={(e) => handlePostChange(index, e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={`Link do post ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading || !formData.username || !formData.followers || !formData.bio}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading || !formData.username || !formData.followers || !formData.bio
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {isLoading ? 'Analisando...' : 'Analisar Perfil'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
