
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableBody, TableHeader, TableRow, TableCell } from "@/components/ui/table";

type Job = { id: string; profit: number; deadline: number };

export default function JobSchedulerInput({
  jobs,
  setJobs,
  maxDeadline,
  setMaxDeadline,
}: {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  maxDeadline: number;
  setMaxDeadline: (n: number) => void;
}) {
  const [newJob, setNewJob] = useState<Job>({ id: '', profit: 0, deadline: 0 });

  const addJob = () => {
    if (!newJob.id || newJob.profit <= 0 || newJob.deadline <= 0) return;
    setJobs([...jobs, newJob]);
    setNewJob({ id: '', profit: 0, deadline: 0 });
  };
  const removeJob = (idx: number) => {
    setJobs(jobs.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input placeholder="Job ID" value={newJob.id} onChange={e=>setNewJob({...newJob, id: e.target.value})} className="w-18" />
        <Input placeholder="Profit" type="number" value={newJob.profit} onChange={e=>setNewJob({...newJob, profit: Number(e.target.value)})} className="w-18" />
        <Input placeholder="Deadline" type="number" value={newJob.deadline} onChange={e=>setNewJob({...newJob, deadline: Number(e.target.value)})} className="w-18" />
        <Button onClick={addJob} variant="outline">Add</Button>
        <Input placeholder="Max Deadline" type="number" value={maxDeadline} onChange={e=>setMaxDeadline(Number(e.target.value))} className="w-28" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job, idx) => (
            <TableRow key={idx}>
              <TableCell>{job.id}</TableCell>
              <TableCell>{job.profit}</TableCell>
              <TableCell>{job.deadline}</TableCell>
              <TableCell><Button size="sm" variant="ghost" onClick={() => removeJob(idx)}>Remove</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
