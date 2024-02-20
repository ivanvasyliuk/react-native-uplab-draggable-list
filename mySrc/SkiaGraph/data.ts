export type DataPoint = {
  date: string;
  value: number;
};
export const originalData: DataPoint[] = [...new Array(5)].map((_, index) => ({
  date: `2000-02-0${index}T05:00:00.000Z`,
  value: Math.random() * 100,
}));
// [
//   { date: "2000-02-01T05:00:00.000Z", value: 250 },
//   { date: "2000-02-02T05:00:00.000Z", value: 300.35 },
//   { date: "2000-02-03T05:00:00.000Z", value: 150.84 },
//   { date: "2000-02-04T05:00:00.000Z", value: 120.27 },
//   { date: "2000-02-05T05:00:00.000Z", value: 105.41 },
//   { date: "2000-02-06T05:00:00.000Z", value: 100.11 },
//   { date: "2000-02-07T05:00:00.000Z", value: 98.45 },
//   { date: "2000-02-08T05:00:00.000Z", value: 105.81 },
// ];
