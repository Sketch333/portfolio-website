export const exampleCourses = [
  { code: 'EX-101', day: 'Monday', time: '09:00–10:00', room: 'Room A' },
  { code: 'EX-202', day: 'Monday', time: '10:00–11:00', room: 'Room A' },
  { code: 'EX-303', day: 'Tuesday', time: '09:00–10:00', room: 'Room B' },
] as const;

export function SchedulerExampleTable() {
  return (
    <div className="overflow-x-auto">
      <table aria-label="Example resolved timetable" className="w-full min-w-80 border-collapse text-left text-sm">
        <thead><tr className="border-b border-border"><th scope="col" className="p-2">Course</th><th scope="col" className="p-2">Day</th><th scope="col" className="p-2">Time</th><th scope="col" className="p-2">Room</th></tr></thead>
        <tbody>{exampleCourses.map((course) => <tr key={course.code} className="border-b border-border/60"><th scope="row" className="p-2 font-medium">{course.code}</th><td className="p-2">{course.day}</td><td className="p-2">{course.time}</td><td className="p-2">{course.room}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

export function SchedulerExampleIntro() {
  return <p className="text-sm leading-6 text-muted-foreground">Interactive system walkthrough. Fictional course codes and rooms illustrate constraint handling; this example does not run a live solver or represent a university timetable.</p>;
}
