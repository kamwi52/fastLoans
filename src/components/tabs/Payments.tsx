import { useState } from 'react';
import type { Transaction, Loan } from '../../types';
import { fmtZMK, formatDate } from '../../utils/formatters';
import './Payments.css';

interface PaymentsProps {
  transactions: Transaction[];
  loans: Loan[];
}

export default function Payments({ transactions, loans }: PaymentsProps) {
  const [payAmount, setPayAmount] = useState('');
  const [selectedLoan, setSelectedLoan] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const activeLoans = loans.filter((l) => l.status === 'Active');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan || !payAmount) return;
    setPayLoading(true);
    setTimeout(() => {
      setPayLoading(false);
      setPaySuccess(true);
      setPayAmount('');
      setSelectedLoan('');
      setTimeout(() => setPaySuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="payments-root">
      <div className="payments-top">
        {/* Make a Payment */}
        <div className="payment-form-card">
          <h2>Make a Payment</h2>
          <p className="payment-form-sub">Repay your loan quickly and securely</p>

          {paySuccess && (
            <div className="pay-success">
              ✅ Payment submitted successfully! It will reflect within 1–2 business days.
            </div>
          )}

          <form onSubmit={handlePayment} className="payment-form">
            <div className="pay-form-group">
              <label>Select Loan</label>
              <select
                value={selectedLoan}
                onChange={(e) => setSelectedLoan(e.target.value)}
                required
              >
                <option value="">— Choose a loan —</option>
                {activeLoans.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.type} Loan ({l.id}) — Balance: {fmtZMK(l.balance)}
                  </option>
                ))}
              </select>
            </div>

            <div className="pay-form-group">
              <label>Payment Amount (ZMK)</label>
              <div className="pay-input-wrap">
                <span className="pay-currency">K</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  required
                />
              </div>
              {selectedLoan && (
                <div className="quick-amounts">
                  {activeLoans
                    .filter((l) => l.id === selectedLoan)
                    .map((l) => (
                      <div key={l.id} className="quick-amount-btns">
                        <button
                          type="button"
                          onClick={() => setPayAmount(String(l.monthlyPayment))}
                        >
                          Monthly ({fmtZMK(l.monthlyPayment)})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayAmount(String(l.monthlyPayment * 2))}
                        >
                          Double
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayAmount(String(l.balance))}
                        >
                          Full Balance
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="pay-form-group">
              <label>Payment Method</label>
              <div className="pay-methods">
                <label className="pay-method active">
                  <input type="radio" name="method" defaultChecked />
                  <span>🏦 Bank Transfer (EFT)</span>
                </label>
                <label className="pay-method">
                  <input type="radio" name="method" />
                  <span>💳 Debit Card</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className={`pay-submit-btn ${payLoading ? 'loading' : ''}`}
              disabled={payLoading}
            >
              {payLoading ? (
                <><span className="spinner"></span> Processing…</>
              ) : (
                '💸 Submit Payment'
              )}
            </button>
          </form>
        </div>

        {/* Payment Summary */}
        <div className="payment-summary-card">
          <h3>Upcoming Payments</h3>
          <div className="upcoming-list">
            {activeLoans.map((loan) => (
              <div key={loan.id} className="upcoming-item">
                <div className="upcoming-left">
                  <span className="upcoming-type">{loan.type} Loan</span>
                  <span className="upcoming-date">Due: {formatDate(loan.nextPaymentDate)}</span>
                </div>
                <span className="upcoming-amount">{fmtZMK(loan.monthlyPayment)}</span>
              </div>
            ))}
          </div>

          <div className="payment-tips">
            <h4>💡 Payment Tips</h4>
            <ul>
              <li>Pay before the due date to avoid penalties.</li>
              <li>Extra payments reduce your interest burden.</li>
              <li>Set up a debit order for automatic payments.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="txn-history-card">
        <h3>Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="txn-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Loan</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{formatDate(txn.date)}</td>
                  <td>{txn.description}</td>
                  <td>
                    <span className="txn-loan-badge">{txn.loanId}</span>
                  </td>
                  <td className={`txn-amount ${txn.type}`}>
                    {txn.type === 'debit' ? '-' : '+'}{fmtZMK(txn.amount)}
                  </td>
                  <td>
                    <span className={`txn-type-badge ${txn.type}`}>
                      {txn.type === 'debit' ? 'Payment' : 'Credit'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
