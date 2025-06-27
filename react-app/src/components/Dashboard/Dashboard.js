import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import AllExpenses from '../AllExpenses';
import GroupsSidebar from '../Groups/GroupsSidebar';
import FriendSideBar from '../friends/SideBar';
import CreateExpenseModal from '../CreateExpenseModal';
import './Dashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAllExpenses } from '../../store/expense';

const Dashboard = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const myPayableExpenses = useSelector(state => state.expense.payableExpenses);
  const myReceivableExpenses = useSelector(state => state.expense.receivableExpenses);

  const allExpenses = { ...myPayableExpenses, ...myReceivableExpenses };

  useEffect(() => {
    dispatch(getAllExpenses());
  }, [dispatch]);

  let totalLentOut = 0;
  let totalOwed = 0;
  let youOweUsers = [];
  let othersOweYou = [];
  let overlapping = [];

  for (let expense of Object.values(allExpenses)) {
    if (expense.Fronter.id === currentUser?.id) totalLentOut += expense.amount;
    if (expense.Recipient.id === currentUser?.id) totalOwed += expense.amount;
  }

  for (let expense of Object.values(myPayableExpenses)) {
    let personYouOwe = youOweUsers.find(user => user.id === expense.Fronter.id);
    if (personYouOwe) {
      personYouOwe.amount += expense.amount;
    } else {
      youOweUsers.push({
        id: expense.Fronter.id,
        amount: expense.amount,
        first_name: expense.Fronter.first_name,
        last_name: expense.Fronter.last_name
      });
    }
  }

  for (let expense of Object.values(myReceivableExpenses)) {
    let personOwesYou = othersOweYou.find(user => user.id === expense.Recipient.id);
    if (personOwesYou) {
      personOwesYou.amount += expense.amount;
    } else {
      othersOweYou.push({
        id: expense.Recipient.id,
        amount: expense.amount,
        first_name: expense.Recipient.first_name,
        last_name: expense.Recipient.last_name
      });
    }
  }

  for (let expense of Object.values(allExpenses)) {
    const isFronter = expense.Fronter.id === currentUser?.id;
    const id = isFronter ? expense.Recipient.id : expense.Fronter.id;
    const name = isFronter ? expense.Recipient : expense.Fronter;
    let opposingPerson = overlapping.find(user => user.id === id);

    if (opposingPerson) {
      opposingPerson.amount += isFronter ? expense.amount : -expense.amount;
    } else {
      overlapping.push({
        id,
        amount: isFronter ? expense.amount : -expense.amount,
        first_name: name.first_name,
        last_name: name.last_name
      });
    }
  }

  return (
    <div className='outer-container'>
      <div className='left-side'>
        <div className='left-empty-div'></div>
        <div className='right-side-bar-div'>
          <div className='active-side-bar'>
            <div className='dashboard'><i className="fa-solid fa-house"></i>&nbsp; <NavLink className="dashboard-link" to="/dashboard">Dashboard</NavLink></div>
            <div className='all-expenses'><i className="fa-solid fa-list"></i>&nbsp; <NavLink className="all-expenses-link" to="/expenses/all">All Expenses</NavLink></div>
            <div className='group'><GroupsSidebar /></div>
            <div className='friends'><FriendSideBar /></div>
          </div>
        </div>
      </div>

      <div className='middle-side'>
        <div className='title'>
          <div className='dashboard-top-expenses'>
            <h1 id='dashboard-header'>Dashboard</h1>
            <CreateExpenseModal />
          </div>

          <div className='dashboard-values-total-expenses-container'>
            <div className='dashboard-values-container'>
              <div className='dashboard-values-labels'>total balance</div>
              <div id='dashboard-values-balance'>${(totalLentOut - totalOwed).toFixed(2)}</div>
            </div>
            <div className='dashboard-values-container'>
              <div className='dashboard-values-labels'>you owe</div>
              <div id='dashboard-values-owed'>${totalOwed.toFixed(2)}</div>
            </div>
            <div className='dashboard-values-container'>
              <div className='dashboard-values-labels'>you are owed</div>
              <div id='dashboard-values-owe'>${totalLentOut.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className='content'>
          <div className='dashboard-content-total-container'>

            <div className='you-owe-column-container'>
              <div className='you-owe-are-owed-label'>YOU OWE</div>
              <div className='net-amounts-disclaimer'>*Net amounts may not add up to dashboard value</div>
              {overlapping.filter(exp => exp.amount < 0).map(expense => (
                <div className='dashboard-each-user-container' key={`dash ${expense.id}`}>
                  <i className="fa-solid fa-user"></i>
                  <div className='dashboard-each-user-right-side'>
                    <div className='dashboard-expense-name'>{expense.first_name} {expense.last_name}</div>
                    <div className='dashboard-you-owe-text'>you owe ${(expense.amount * -1).toFixed(2)}</div>
                    {[...Object.values(myReceivableExpenses), ...Object.values(myPayableExpenses)]
                      .filter(e => e.Fronter.id === expense.id || e.Recipient.id === expense.id)
                      .map((e, i) => (
                        <li className='dashboard-list-item' key={i}>
                          {e.Recipient.id === expense.id
                            ? `${e.Recipient.first_name} owes you ${e.amount.toFixed(2)} for "${e.description}"`
                            : `You owe ${e.Fronter.first_name} ${e.amount.toFixed(2)} for "${e.description}"`}
                        </li>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className='you-are-owed-column-container'>
              <div className='you-owe-are-owed-label'>YOU ARE OWED</div>
              <div className='net-amounts-disclaimer'>*Net amounts may not add up to dashboard value</div>
              {overlapping.filter(exp => exp.amount > 0).map(expense => (
                <div className='dashboard-each-user-container' key={`dash ${expense.id}`}>
                  <i className="fa-solid fa-user"></i>
                  <div className='dashboard-each-user-right-side'>
                    <div className='dashboard-expense-name'>{expense.first_name} {expense.last_name}</div>
                    <div className='dashboard-you-are-owed-text'>owes you ${expense.amount.toFixed(2)}</div>
                    {[...Object.values(myReceivableExpenses), ...Object.values(myPayableExpenses)]
                      .filter(e => e.Fronter.id === expense.id || e.Recipient.id === expense.id)
                      .map((e, i) => (
                        <li className='dashboard-list-item' key={i}>
                          {e.Recipient.id === expense.id
                            ? `${e.Recipient.first_name} owes you ${e.amount.toFixed(2)} for "${e.description}"`
                            : `You owe ${e.Fronter.first_name} ${e.amount.toFixed(2)} for "${e.description}"`}
                        </li>
                      ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <div className='right-side'>
        <div className='left-with-info'></div>
        <div className='right-empty'></div>
      </div>
    </div>
  );
};

export default Dashboard;
