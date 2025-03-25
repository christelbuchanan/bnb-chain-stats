import React, { useEffect, useRef } from 'react';
import { CommitActivity } from '../types';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ActivityChartProps {
  commitActivity: CommitActivity[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ commitActivity }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current || !commitActivity || commitActivity.length === 0) return;
    
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Process data for the chart
    const labels: string[] = [];
    const data: number[] = [];
    
    // Get the last 12 weeks of data or whatever is available
    const recentActivity = commitActivity.slice(-12);
    
    recentActivity.forEach((week) => {
      const date = new Date(week.week * 1000);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      data.push(week.total);
    });
    
    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Commits',
            data,
            backgroundColor: '#F0B90B',
            borderColor: '#F0B90B',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#1E2026',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: '#F0B90B',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: (items) => {
                return `Week of ${items[0].label}`;
              },
              label: (context) => {
                return `${context.parsed.y} commits`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [commitActivity]);
  
  if (!commitActivity || commitActivity.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No activity data available
      </div>
    );
  }
  
  return <canvas ref={chartRef} />;
};

export default ActivityChart;
