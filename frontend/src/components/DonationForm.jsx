import { useState } from 'react';
import { ethers } from 'ethers';

const DONATION_CONTRACT_ABI = [
  "function donate(string message) public payable"
];

const DonationForm = ({ provider, contractAddress, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDonate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      if (!provider) throw new Error('Wallet belum terkoneksi');
      if (!contractAddress) throw new Error('Contract address belum diatur');
      if (!amount || isNaN(amount) || Number(amount) <= 0) throw new Error('Nominal ETH tidak valid');

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, DONATION_CONTRACT_ABI, signer);
      const tx = await contract.donate(message, {
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      setSuccess('Donasi berhasil!');
      setAmount('');
      setMessage('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Gagal donasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="donation-form" onSubmit={handleDonate}>
      <h3>Tambah Donasi</h3>
      <div className="form-group">
        <label>Nominal (ETH)</label>
        <input
          type="number"
          step="0.0001"
          min="0"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.01"
          required
        />
      </div>
      <div className="form-group">
        <label>Pesan (opsional)</label>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Terima kasih!"
        />
      </div>
      <button className="btn btn-primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Mengirim...' : 'Kirim Donasi'}
      </button>
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}
    </form>
  );
};

export default DonationForm;
