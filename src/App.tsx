import React, { useState, useMemo } from 'react';
import { Trash2, Plus, Check, Quote } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Complete brand identity guidelines', completed: false },
    { id: '2', text: 'Prepare presentation for client meeting', completed: false },
    { id: '3', text: 'Review feedback from engineering team', completed: true },
    { id: '4', text: 'Update website hero typography', completed: false },
    { id: '5', text: 'Book tickets for design conference', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const tasksCompleted = tasks.filter(t => t.completed).length;
  const targetTokens = Math.max(8, tasks.length); // target: 8, or dynamic
  const completionPercentage = tasks.length === 0 ? 0 : Math.round((tasksCompleted / tasks.length) * 100);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short', 
    day: 'numeric'
  });

  // SVG Circle Math for Task Meter
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  // Motivation Quote Logic
  const dailyQuote = useMemo(() => {
    const MOTIVATIONS = [
      "The secret of getting ahead is getting started.",
      "It always seems impossible until it's done.",
      "Don't stop when you're tired. Stop when you're done.",
      "Small progress is still progress.",
      "Focus on being productive instead of busy.",
      "Do something today that your future self will thank you for.",
      "Action is the foundational key to all success."
    ];
    return MOTIVATIONS[new Date().getDay() % MOTIVATIONS.length];
  }, []);

  // Graph Data (historical is mocked, 'Today' is live)
  const graphData = useMemo(() => {
    return [
      { day: '6d ago', tasks: 3 },
      { day: '5d ago', tasks: 5 },
      { day: '4d ago', tasks: 2 },
      { day: '3d ago', tasks: 6 },
      { day: '2d ago', tasks: 4 },
      { day: 'Yesterday', tasks: 7 },
      { day: 'Today', tasks: tasksCompleted },
    ];
  }, [tasksCompleted]);

  // Custom Graph Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-100 text-sm font-bold text-stone-700">
          {`${payload[0].value} completed`}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 p-4 sm:p-8 flex flex-col items-center selection:bg-violet-200">
      <div className="w-full max-w-[1100px] flex flex-col h-full grow">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 px-2 md:px-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">My Task</h1>
          <div className="text-sm font-semibold text-stone-500 uppercase tracking-widest bg-white/60 px-5 py-2.5 rounded-full shadow-sm border border-stone-200/60 backdrop-blur-sm">
            {currentDate}
          </div>
        </header>

        {/* Bento Grid layout switching to flex rows within columns for robust structure */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full flex-grow">
          
          {/* Left Column - Active Tasks & Graph */}
          <div className="md:col-span-2 flex flex-col gap-6 h-full">
            
            {/* Active Tasks Card */}
            <section className="bg-white rounded-[2rem] p-6 sm:p-8 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 flex-grow min-h-[400px] relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 shrink-0 z-10">
                <h2 className="text-xl font-bold text-stone-800">Active Tasks</h2>
                <span className="bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
                  {tasks.length - tasksCompleted} REMAINING
                </span>
              </div>
              
              <div className="flex-grow overflow-y-auto pr-3 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-stone-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-stone-300 transition-colors z-10">
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-stone-400 space-y-3 pb-8">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-2">
                      <Check size={24} className="text-stone-300" />
                    </div>
                    <p className="text-[15px] font-medium">All caught up!</p>
                    <p className="text-sm">Check your quick add section.</p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {tasks.map((task) => (
                      <li
                        key={task.id}
                        className={`group flex items-center p-4 rounded-2xl transition-all duration-300 border border-transparent ${
                          task.completed 
                            ? 'bg-stone-50/50 opacity-60' 
                            : 'bg-white hover:bg-stone-50 hover:border-stone-100 shadow-sm shadow-stone-100/50'
                        }`}
                      >
                        {/* Fully rounded circle checkbox */}
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`shrink-0 w-[26px] h-[26px] rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 ${
                            task.completed 
                              ? 'bg-violet-500 border-violet-500 text-white scale-95' 
                              : 'border-stone-300 bg-white hover:border-violet-400 group-hover:scale-105'
                          }`}
                        >
                          {task.completed && <Check size={14} strokeWidth={3.5} />}
                        </button>
                        
                        <span className={`flex-grow font-medium text-[15.5px] transition-all duration-300 ${
                          task.completed ? 'line-through text-stone-400' : 'text-stone-700'
                        }`}>
                          {task.text}
                        </span>

                        {/* Soft rounded delete button */}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="shrink-0 text-red-400 ml-3 w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100 lg:opacity-0 sm:opacity-100"
                          aria-label="Delete task"
                        >
                          <Trash2 size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* Progress Graph Card */}
            <section className="bg-white rounded-[2rem] p-6 sm:px-8 sm:pt-6 sm:pb-2 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 h-[260px] shrink-0 relative overflow-hidden">
              <h2 className="text-xl font-bold text-stone-800 mb-2 z-10 shrink-0">Weekly Progress</h2>
              <div className="w-full h-full -ml-6 -mb-4 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graphData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#a8a29e', fontWeight: 600 }} 
                      dy={10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e7e5e4', strokeWidth: 2, strokeDasharray: '4 4' }} />
                    <Area 
                      type="monotone" 
                      dataKey="tasks" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorTasks)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

          </div>

          {/* Right Column - Small utilities */}
          <div className="md:col-span-1 flex flex-col gap-6">

            {/* Quick Add Card */}
            <section className="bg-gradient-to-br from-violet-100 to-fuchsia-50 text-violet-900 rounded-[2rem] p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 relative overflow-hidden h-fit sm:h-[220px]">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-200/50 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-fuchsia-200/40 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-bold">Quick Add</h2>
                <p className="text-[14px] text-violet-700/80 mt-1 mb-6 font-medium">What needs to be done today?</p>
              </div>
              
              <form onSubmit={addTask} className="mt-auto relative flex items-center z-10 w-full group">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Type a task..."
                  className="w-full bg-white/60 focus:bg-white border border-white/50 focus:border-violet-300 rounded-full py-3.5 pl-5 pr-14 text-[14.5px] text-violet-900 placeholder:text-violet-900/40 outline-none transition-all shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!newTaskText.trim()}
                  className="absolute right-2 p-2 bg-violet-500 text-white rounded-full hover:bg-violet-600 shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100 disabled:hover:bg-violet-500"
                >
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </form>
            </section>

            {/* Focus / Stats Meter Card */}
            <section className="bg-white rounded-[2rem] p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 relative items-center justify-between overflow-hidden h-[240px]">
              <div className="flex justify-between items-center w-full shrink-0 z-10 mb-2">
                <h2 className="text-xl font-bold text-stone-800">Focus</h2>
                {completionPercentage === 100 && tasks.length > 0 && (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    Done
                  </span>
                )}
              </div>

              {/* Real SVG Radial Progress */}
              <div className="relative w-[110px] h-[110px] flex items-center justify-center my-2 z-10">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r={radius} 
                    className="stroke-stone-100" 
                    strokeWidth="8" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="50" cy="50" r={radius} 
                    className="stroke-violet-500 transition-all duration-1000 ease-out" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset} 
                    strokeLinecap="round" 
                  />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[26px] font-extrabold text-stone-800 tracking-tighter leading-none mt-1">
                    {completionPercentage}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end w-full mt-auto text-[12px] text-stone-500 font-semibold z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-stone-400 tracking-wider">Completed</span>
                  <span className="text-stone-800 text-[13px]">{tasksCompleted} / {tasks.length}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase text-stone-400 tracking-wider">Streak</span>
                  <span className="text-violet-600 text-[13px]">4 days</span>
                </div>
              </div>
            </section>

            {/* Daily Motivation Card */}
            <section className="bg-gradient-to-br from-orange-50 to-amber-50 text-amber-900 rounded-[2rem] p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-amber-200/50 relative overflow-hidden group h-[210px]">
              <div className="absolute -right-6 -bottom-6 opacity-[0.05] transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700">
                <Quote size={120} />
              </div>
              
              <div className="flex items-center space-x-2 mb-4 relative z-10">
                <div className="bg-amber-100 p-1.5 rounded-full">
                  <Quote size={14} className="text-amber-500" fill="currentColor" />
                </div>
                <h2 className="text-[11px] font-bold tracking-widest uppercase text-amber-600/80">
                  Daily Thought
                </h2>
              </div>
              
              <div className="relative z-10 flex-grow flex items-center">
                <p className="font-semibold text-[16px] leading-relaxed text-amber-800/90 italic">
                  "{dailyQuote}"
                </p>
              </div>
            </section>

          </div>

        </main>
      </div>
    </div>
  );
}
