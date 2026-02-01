// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DonationContract
 * @dev Smart contract untuk menerima dan mengelola donasi di blockchain Ethereum
 * @notice Deploy contract ini di Sepolia Testnet untuk testing
 */
contract DonationContract {
    // ============ State Variables ============
    
    /// @dev Alamat pemilik contract (yang bisa withdraw)
    address public owner;
    
    /// @dev Total donasi yang terkumpul
    uint256 public totalDonations;
    
    /// @dev Struct untuk menyimpan data donasi
    struct Donation {
        address donor;      // Alamat pendonasi
        uint256 amount;     // Jumlah donasi dalam Wei
        uint256 timestamp;  // Waktu donasi
        string message;     // Pesan dari donatur
    }
    
    /// @dev Array untuk menyimpan semua donasi
    Donation[] public donations;
    
    /// @dev Mapping untuk tracking total donasi per alamat
    mapping(address => uint256) public donorTotalAmount;
    
    // ============ Events ============
    
    /// @dev Event yang di-emit saat ada donasi baru
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp,
        string message
    );
    
    /// @dev Event yang di-emit saat owner withdraw dana
    event FundsWithdrawn(
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );
    
    // ============ Modifiers ============
    
    /// @dev Modifier untuk membatasi akses hanya untuk owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya owner yang dapat melakukan ini");
        _;
    }
    
    // ============ Constructor ============
    
    /// @dev Constructor - set deployer sebagai owner
    constructor() {
        owner = msg.sender;
    }
    
    // ============ Main Functions ============
    
    /**
     * @dev Fungsi untuk menerima donasi
     * @param _message Pesan dari donatur (opsional)
     */
    function donate(string memory _message) public payable {
        // Validasi jumlah donasi harus lebih dari 0
        require(msg.value > 0, "Jumlah donasi harus lebih dari 0");
        
        // Simpan data donasi ke array
        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        }));
        
        // Update total donasi
        totalDonations += msg.value;
        
        // Update total donasi per alamat
        donorTotalAmount[msg.sender] += msg.value;
        
        // Emit event
        emit DonationReceived(msg.sender, msg.value, block.timestamp, _message);
    }
    
    /**
     * @dev Fungsi untuk mendapatkan semua donasi
     * @return Array dari semua donasi
     */
    function getAllDonations() public view returns (Donation[] memory) {
        return donations;
    }
    
    /**
     * @dev Fungsi untuk mendapatkan jumlah donasi
     * @return Jumlah total donasi yang tercatat
     */
    function getDonationCount() public view returns (uint256) {
        return donations.length;
    }
    
    /**
     * @dev Fungsi untuk mendapatkan donasi berdasarkan index
     * @param _index Index donasi dalam array
     * @return donor Alamat pendonasi
     * @return amount Jumlah donasi
     * @return timestamp Waktu donasi
     * @return message Pesan donatur
     */
    function getDonation(uint256 _index) public view returns (
        address donor,
        uint256 amount,
        uint256 timestamp,
        string memory message
    ) {
        require(_index < donations.length, "Index tidak valid");
        Donation memory d = donations[_index];
        return (d.donor, d.amount, d.timestamp, d.message);
    }
    
    /**
     * @dev Fungsi untuk owner menarik dana
     * @param _amount Jumlah yang ingin ditarik (dalam Wei)
     */
    function withdraw(uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Saldo tidak mencukupi");
        
        // Transfer ke owner
        payable(owner).transfer(_amount);
        
        // Emit event
        emit FundsWithdrawn(owner, _amount, block.timestamp);
    }
    
    /**
     * @dev Fungsi untuk mendapatkan saldo contract
     * @return Saldo contract dalam Wei
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // ============ Receive Function ============
    
    /// @dev Fungsi receive untuk menerima ETH langsung tanpa data
    receive() external payable {
        donate("");
    }
}
