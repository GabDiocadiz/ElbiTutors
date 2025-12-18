import { mockUser } from '../utils/mockData';

export default function Dashboard() {
  // mock user for testing
  const user = mockUser;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
      <p>Program: {user.degree_program}</p>
      <p>Role: {user.role}</p>
      {user.isLRCAdmin && <button className="bg-red-500 text-white">Admin Tools</button>}
    </div>
  );
}