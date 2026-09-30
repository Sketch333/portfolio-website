export const exampleCourses = [
  { code: 'EX-101', day: 'Monday', time: '09:00–10:00', room: 'Room A', seats: 24, capacity: 30 },
  { code: 'EX-202', day: 'Monday', time: '10:00–11:00', room: 'Room A', seats: 28, capacity: 30 },
  { code: 'EX-303', day: 'Tuesday', time: '09:00–10:00', room: 'Room B', seats: 18, capacity: 20 },
] as const;

export function SchedulerExampleCapacity() {
  return <div><h3 className="font-semibold">Capacity and schedule state</h3><p className="mt-2 text-sm leading-6">Each fictional enrollment fits its assigned room. Room A has separate Monday slots, so it is never double-booked.</p><ul className="mt-2 list-inside list-disc text-sm leading-6">{exampleCourses.map((course) => <li key={course.code}>{course.code}: {course.seats} of {course.capacity} seats in {course.room}</li>)}</ul></div>;
}

export function SchedulerExampleProgress() {
  return <div><h3 className="font-semibold">CP-SAT scheduling progress</h3><p className="mt-2 text-sm leading-6">An illustrative sequence, not a live solver run or measured execution progress.</p><ol className="mt-2 list-inside list-decimal text-sm leading-6"><li>Prepare course, room, time, and capacity inputs.</li><li>Apply no-overlap and seat-capacity constraints.</li><li>Inspect a feasible example assignment.</li></ol></div>;
}

export function SchedulerExampleTable() {
  return (
    <div className="overflow-x-auto">
      <table aria-label="Example resolved timetable" className="w-full min-w-80 border-collapse text-left text-sm">
        <thead><tr className="border-b border-border"><th scope="col" className="p-2">Course</th><th scope="col" className="p-2">Day</th><th scope="col" className="p-2">Time</th><th scope="col" className="p-2">Room</th><th scope="col" className="p-2">Seats / capacity</th></tr></thead>
        <tbody>{exampleCourses.map((course) => <tr key={course.code} className="border-b border-border/60"><th scope="row" className="p-2 font-medium">{course.code}</th><td className="p-2">{course.day}</td><td className="p-2">{course.time}</td><td className="p-2">{course.room}</td><td className="p-2">{course.seats} / {course.capacity}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

export function SchedulerExampleIntro() {
  return <p className="text-sm leading-6 text-muted-foreground">Interactive system walkthrough. Fictional course codes and rooms illustrate constraint handling; this example does not run a live solver or represent a university timetable.</p>;
}
