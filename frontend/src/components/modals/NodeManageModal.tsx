import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Server, MapPin, Battery, Cpu } from 'lucide-react';
import { createNode, updateNode, deleteNode } from '../../services/api';

interface NodeManageModalProps {
  isOpen: boolean;
  nodeToEdit?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const NodeManageModal: React.FC<NodeManageModalProps> = ({
  isOpen,
  nodeToEdit,
  onClose,
  onSuccess
}) => {
  const [nodeCode, setNodeCode] = useState('');
  const [name, setName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState<'ONLINE' | 'OFFLINE' | 'WARNING'>('ONLINE');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (nodeToEdit) {
      setNodeCode(nodeToEdit.node_code || nodeToEdit.id || '');
      setName(nodeToEdit.name || '');
      setLocationName(nodeToEdit.location_name || nodeToEdit.location || '');
      setLatitude(nodeToEdit.latitude ? String(nodeToEdit.latitude) : '17.4000');
      setLongitude(nodeToEdit.longitude ? String(nodeToEdit.longitude) : '78.4500');
      setStatus(nodeToEdit.status || 'ONLINE');
      setBatteryLevel(nodeToEdit.battery_level !== undefined ? nodeToEdit.battery_level : 100);
    } else {
      setNodeCode(`NODE-00${Math.floor(Math.random() * 90 + 10)}`);
      setName('New Environmental Sensor Node');
      setLocationName('Hyderabad Central Sector');
      setLatitude('17.4350');
      setLongitude('78.4480');
      setStatus('ONLINE');
      setBatteryLevel(100);
    }
    setError(null);
  }, [nodeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        node_code: nodeCode,
        name,
        location_name: locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        status,
        battery_level: Number(batteryLevel)
      };

      if (nodeToEdit?.id) {
        await updateNode(nodeToEdit.id, payload);
      } else {
        await createNode(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save sensor node');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!nodeToEdit?.id) return;
    if (!window.confirm(`Are you sure you want to delete node ${nodeCode}?`)) return;

    setIsSubmitting(true);
    try {
      await deleteNode(nodeToEdit.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete node');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full text-slate-100 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {nodeToEdit ? 'Edit Sensor Node' : 'Add New Sensor Node'}
            </h3>
            <p className="text-xs text-slate-400">Configure ESP32 node deployment & location</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Node Code</label>
              <input
                type="text"
                required
                value={nodeCode}
                onChange={(e) => setNodeCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Node Status</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="ONLINE">ONLINE</option>
                <option value="WARNING">WARNING</option>
                <option value="OFFLINE">OFFLINE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Node Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location Name</label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Battery (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-800">
            {nodeToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 rounded-lg text-xs font-medium cursor-pointer"
              >
                Delete Node
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium cursor-pointer shadow-md shadow-cyan-600/20"
              >
                {isSubmitting ? 'Saving...' : (nodeToEdit ? 'Update Node' : 'Save Node')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
