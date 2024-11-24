import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Product } from "@/hooks/useProducts";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface ChartsProps {
  products: Product[];
}

export function Charts({ products }: ChartsProps) {
  const categoryData = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = { name: category, value: 0 };
    }
    acc[category].value += product.price * product.quantity;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);

  const pieData = Object.values(categoryData);

  const conditionData = products.reduce((acc, product) => {
    const condition = product.condition;
    if (!acc[condition]) {
      acc[condition] = { condition, value: 0 };
    }
    acc[condition].value += product.quantity;
    return acc;
  }, {} as Record<string, { condition: string; value: number }>);

  const barData = Object.values(conditionData);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center">
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle>Total Value by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle>Items by Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="condition" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
