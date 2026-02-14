import React from "react";

type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  sector?: string;
  location?: string;
};

type ClientCardProps = {
  client: Client;
  onDelete?: (id: string) => void;
};

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete }) => {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          
          {/* Avatar Circle */}
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
            {client.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {client.name}
            </h2>
            <p className="text-sm text-gray-500">{client.email}</p>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(client.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition"
          >
            Delete
          </button>
        )}
      </div>

      {/* Info Section */}
      <div className="space-y-2 text-sm text-gray-600">
        {client.phone && (
          <p>
            <span className="font-medium text-gray-700">Phone:</span>{" "}
            {client.phone}
          </p>
        )}

        {client.sector && (
          <p>
            <span className="font-medium text-gray-700">Sector:</span>{" "}
            {client.sector}
          </p>
        )}

        {client.location && (
          <p>
            <span className="font-medium text-gray-700">Location:</span>{" "}
            {client.location}
          </p>
        )}
      </div>  
    </div>
  );
};

export default ClientCard;
