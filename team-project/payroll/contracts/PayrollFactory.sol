contract PayrollFactory{ 
    Payroll[] public Payrolls;

    function createCryptoCoin(string memory tokenName, string memory tokenSymbol, uint initialTokenCapital, uint ratio) public {
        Payroll cryptoCoin = new Payroll(tokenName,tokenSymbol,initialTokenCapital,ratio);
        Payrolls.push(cryptoCoin);
    }


}
