import { useEffect, useState } from 'react'
import {
  ShoppingCart,
  ShieldAlert,
  Users,
  BarChart3,
  FileText,
  Bot,
  Package,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Send,
  Activity,
} from 'lucide-react'

type Order = {
  id: string
  customer: string
  product: string
  amount: number
  status: string
  risk?: string
}

type DashboardData = {
  totalRevenue: number
  totalOrders: number
  customers: number
  highRiskOrders: number
}

type WorkflowResult = {
  agents: {
    orderAgent: {
      message: string
    }
    fraudAgent: {
      riskLevel: string
      riskScore: number
      reasons: string[]
    }
    customerAgent: {
      segment: string
      recommendation: string
    }
    analysisAgent: {
      totalRevenue: number
      totalOrders: number
      averageOrderValue: number
    }
    reportAgent: {
      report: {
        title: string
        recommendations: string[]
      }
    }
  }
}

function App() {
  const [activeSection, setActiveSection] = useState('Dashboard')
  const [orders, setOrders] = useState<Order[]>([])
  const [dashboard, setDashboard] = useState<DashboardData>({
    totalRevenue: 0,
    totalOrders: 0,
    customers: 0,
    highRiskOrders: 0,
  })

  const [loading, setLoading] = useState(true)
  const [backendStatus, setBackendStatus] = useState('Connecting...')
  const [workflowResult, setWorkflowResult] =
    useState<WorkflowResult | null>(null)

  const [assistantInput, setAssistantInput] = useState('')
  const [assistantResponse, setAssistantResponse] = useState(
    'Hello! I am your AI E-Commerce Assistant. Ask me about orders, fraud, customers, analytics or reports.'
  )

  const loadData = async () => {
    try {
      setLoading(true)

      const [dashboardResponse, ordersResponse] = await Promise.all([
        fetch('http://localhost:5000/api/dashboard'),
        fetch('http://localhost:5000/api/orders'),
      ])

      if (!dashboardResponse.ok || !ordersResponse.ok) {
        throw new Error('Backend request failed')
      }

      const dashboardData = await dashboardResponse.json()
      const ordersData = await ordersResponse.json()

      setDashboard(dashboardData)

      const updatedOrders = ordersData.map((order: Order) => ({
        ...order,
        risk:
          order.amount > 50000 || order.status === 'Pending'
            ? 'High'
            : order.amount > 30000
              ? 'Medium'
              : 'Low',
      }))

      setOrders(updatedOrders)
      setBackendStatus('Connected')
    } catch (error) {
      console.error(error)
      setBackendStatus('Backend Offline')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const runWorkflow = async () => {
    try {
      const order = orders.find((item) => item.risk === 'High') || orders[0]

      const response = await fetch(
        'http://localhost:5000/api/workflow',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order }),
        }
      )

      if (!response.ok) {
        throw new Error('Workflow request failed')
      }

      const data = await response.json()
      setWorkflowResult(data)
    } catch (error) {
      console.error(error)
      setWorkflowResult(null)
    }
  }

  const askAssistant = () => {
    const question = assistantInput.toLowerCase()

    if (question.includes('fraud')) {
      setAssistantResponse(
        'The Fraud Detection Agent identifies suspicious orders using transaction value and order status. High-risk orders are flagged for review.'
      )
    } else if (question.includes('order')) {
      setAssistantResponse(
        `The system currently has ${dashboard.totalOrders.toLocaleString('en-IN')} total orders. ${orders.length} recent orders are loaded from the backend.`
      )
    } else if (question.includes('customer')) {
      setAssistantResponse(
        `The platform currently tracks ${dashboard.customers.toLocaleString('en-IN')} customers. The Customer Analysis Agent segments customers based on order history and spending.`
      )
    } else if (
      question.includes('revenue') ||
      question.includes('sales')
    ) {
      setAssistantResponse(
        `Current dashboard revenue is ₹${dashboard.totalRevenue.toLocaleString('en-IN')}. The Analysis Agent calculates revenue and average order value.`
      )
    } else if (question.includes('report')) {
      setAssistantResponse(
        'The Report Agent generates business summaries, fraud recommendations, customer insights and operational recommendations.'
      )
    } else {
      setAssistantResponse(
        'I can help with orders, fraud detection, customers, revenue, analytics and reports.'
      )
    }

    setAssistantInput('')
  }

  const menu = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Fraud Detection', icon: ShieldAlert },
    { name: 'Customer Analysis', icon: Users },
    { name: 'Analytics', icon: TrendingUp },
    { name: 'Reports', icon: FileText },
    { name: 'AI Assistant', icon: Bot },
  ]

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 p-5 text-white">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-2">
            <Package size={24} />
          </div>

          <div>
            <h1 className="text-lg font-bold">AI E-Commerce</h1>
            <p className="text-xs text-slate-400">
              Intelligence System
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                onClick={() => setActiveSection(item.name)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                  activeSection === item.name
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="ml-64 p-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              AI-POWERED E-COMMERCE PLATFORM
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              {activeSection}
            </h2>

            <p className="mt-2 text-slate-500">
              Multi-agent intelligence for orders, fraud, customers and business analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-2 text-sm ${
                backendStatus === 'Connected'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              ● {backendStatus}
            </span>

            <button
              onClick={loadData}
              className="rounded-lg bg-white p-3 shadow-sm hover:bg-slate-50"
              title="Refresh data"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            Loading data from backend...
          </div>
        ) : (
          <>
            {activeSection === 'Dashboard' && (
              <>
                <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Total Revenue"
                    value={`₹${dashboard.totalRevenue.toLocaleString('en-IN')}`}
                    icon={<IndianRupee size={22} />}
                  />

                  <StatCard
                    title="Total Orders"
                    value={dashboard.totalOrders.toLocaleString('en-IN')}
                    icon={<ShoppingCart size={22} />}
                  />

                  <StatCard
                    title="Customers"
                    value={dashboard.customers.toLocaleString('en-IN')}
                    icon={<Users size={22} />}
                  />

                  <StatCard
                    title="High Risk Orders"
                    value={String(dashboard.highRiskOrders)}
                    icon={<AlertTriangle size={22} />}
                  />
                </section>

                <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        Recent Orders
                      </h3>

                      <p className="text-sm text-slate-500">
                        Live data from the AI E-Commerce backend
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
                      Live Data
                    </span>
                  </div>

                  <OrderTable orders={orders} />
                </section>

                <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                  <AgentCard
                    icon={<ShoppingCart />}
                    title="Order Agent"
                    text="Processes and tracks customer orders."
                  />

                  <AgentCard
                    icon={<ShieldAlert />}
                    title="Fraud Agent"
                    text="Detects suspicious transactions and order patterns."
                  />

                  <AgentCard
                    icon={<Bot />}
                    title="Orchestrator Agent"
                    text="Coordinates all AI agents and workflows."
                  />
                </section>
              </>
            )}

            {activeSection === 'Orders' && (
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-bold">
                  Order Management
                </h3>

                <p className="mb-6 text-sm text-slate-500">
                  Orders retrieved directly from the backend.
                </p>

                <OrderTable orders={orders} />
              </section>
            )}

            {activeSection === 'Fraud Detection' && (
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      AI Fraud Detection
                    </h3>

                    <p className="text-sm text-slate-500">
                      Run the multi-agent fraud analysis workflow.
                    </p>
                  </div>

                  <button
                    onClick={runWorkflow}
                    className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                  >
                    Run AI Workflow
                  </button>
                </div>

                {workflowResult ? (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <InfoCard
                      title="Order Agent"
                      value={
                        workflowResult.agents.orderAgent.message
                      }
                    />

                    <InfoCard
                      title="Fraud Detection Agent"
                      value={`Risk: ${workflowResult.agents.fraudAgent.riskLevel} | Score: ${workflowResult.agents.fraudAgent.riskScore}`}
                    />

                    <InfoCard
                      title="Customer Analysis Agent"
                      value={`${workflowResult.agents.customerAgent.segment} — ${workflowResult.agents.customerAgent.recommendation}`}
                    />

                    <InfoCard
                      title="Analysis Agent"
                      value={`Revenue: ₹${workflowResult.agents.analysisAgent.totalRevenue.toLocaleString('en-IN')} | AOV: ₹${workflowResult.agents.analysisAgent.averageOrderValue.toLocaleString('en-IN')}`}
                    />
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-50 p-8 text-center">
                    <ShieldAlert
                      className="mx-auto mb-3 text-blue-600"
                      size={40}
                    />

                    <p className="text-slate-500">
                      Click "Run AI Workflow" to analyze an order.
                    </p>
                  </div>
                )}
              </section>
            )}

            {activeSection === 'Customer Analysis' && (
              <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <StatCard
                  title="Total Customers"
                  value={dashboard.customers.toLocaleString('en-IN')}
                  icon={<Users size={22} />}
                />

                <InfoCard
                  title="Customer Agent"
                  value="Segments customers using order history and spending patterns."
                />

                <InfoCard
                  title="Recommendations"
                  value="Personalized offers can be generated for returning and loyal customers."
                />
              </section>
            )}

            {activeSection === 'Analytics' && (
              <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <StatCard
                  title="Revenue"
                  value={`₹${dashboard.totalRevenue.toLocaleString('en-IN')}`}
                  icon={<IndianRupee size={22} />}
                />

                <StatCard
                  title="Orders"
                  value={dashboard.totalOrders.toLocaleString('en-IN')}
                  icon={<ShoppingCart size={22} />}
                />

                <InfoCard
                  title="Analysis Agent"
                  value="Analyzes revenue, order volume, average order value and operational performance."
                />
              </section>
            )}

            {activeSection === 'Reports' && (
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <FileText className="text-blue-600" />

                  <div>
                    <h3 className="text-xl font-bold">
                      AI Business Report
                    </h3>

                    <p className="text-sm text-slate-500">
                      Generated by the Report Agent
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InfoCard
                    title="Revenue"
                    value={`₹${dashboard.totalRevenue.toLocaleString('en-IN')}`}
                  />

                  <InfoCard
                    title="Orders"
                    value={dashboard.totalOrders.toLocaleString('en-IN')}
                  />

                  <InfoCard
                    title="Risk Monitoring"
                    value={`${dashboard.highRiskOrders} high-risk order(s) detected`}
                  />

                  <InfoCard
                    title="Report Status"
                    value="AI-generated business report available"
                  />
                </div>
              </section>
            )}

            {activeSection === 'AI Assistant' && (
              <section className="max-w-4xl rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-xl bg-blue-600 p-3 text-white">
                    <Bot size={28} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">
                      AI E-Commerce Assistant
                    </h3>

                    <p className="text-sm text-slate-500">
                      Ask questions about your e-commerce operations.
                    </p>
                  </div>
                </div>

                <div className="mb-6 rounded-xl bg-slate-50 p-5">
                  <p className="text-slate-700">
                    {assistantResponse}
                  </p>
                </div>

                <div className="flex gap-3">
                  <input
                    value={assistantInput}
                    onChange={(event) =>
                      setAssistantInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        askAssistant()
                      }
                    }}
                    placeholder="Ask about orders, fraud, customers, revenue..."
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <button
                    onClick={askAssistant}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                  >
                    <Send size={18} />
                    Ask
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    'Show fraud information',
                    'How many orders?',
                    'Tell me about customers',
                    'What is the revenue?',
                    'Generate report',
                  ].map((question) => (
                    <button
                      key={question}
                      onClick={() => {
                        setAssistantInput(question)
                      }}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm hover:bg-slate-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-sm text-slate-500">
            <th className="pb-3">Order ID</th>
            <th className="pb-3">Customer</th>
            <th className="pb-3">Product</th>
            <th className="pb-3">Amount</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Risk</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b last:border-0">
              <td className="py-4 font-semibold">{order.id}</td>
              <td className="py-4">{order.customer}</td>
              <td className="py-4">{order.product}</td>
              <td className="py-4">
                ₹{order.amount.toLocaleString('en-IN')}
              </td>

              <td className="py-4">
                <span className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-700">
                  {order.status}
                </span>
              </td>

              <td className="py-4">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    order.risk === 'High'
                      ? 'bg-red-50 text-red-700'
                      : order.risk === 'Medium'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-green-50 text-green-700'
                  }`}
                >
                  {order.risk}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

function AgentCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600">
        {icon}
      </div>

      <h3 className="text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </div>
  )
}

function InfoCard({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <div className="mb-2 flex items-center gap-2">
        <Activity size={18} className="text-blue-600" />
        <h4 className="font-semibold">{title}</h4>
      </div>

      <p className="text-sm text-slate-600">{value}</p>
    </div>
  )
}

export default App