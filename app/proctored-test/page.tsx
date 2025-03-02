"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Check,
  Lightbulb,
  Code,
  Timer,
  AlertTriangle,
  Maximize2,
  Mouse,
} from "lucide-react"
import CodeEditor from "@/components/code-editor"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface TestSession {
  startTime: number
  endTime: number
  duration: number
  warnings: number
  tabSwitches: number
  mouseTime: { [key: number]: number }
  submissions: {
    questionIndex: number
    code: string
    isCorrect: boolean
    timestamp: number
  }[]
}

const MAX_WARNINGS = 1
const MOUSE_TIME_LIMIT = 60 // 60 seconds per question

export default function CodingChallenge() {
  const [isTestStarted, setIsTestStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds
  const [warnings, setWarnings] = useState(0)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [testSession, setTestSession] = useState<TestSession>({
    startTime: 0,
    endTime: 0,
    duration: 60,
    warnings: 0,
    tabSwitches: 0,
    mouseTime: {},
    submissions: [],
  })
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [code, setCode] = useState(
    "// Write your Java code here\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Your solution\n    }\n}",
  )
  const [output, setOutput] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mouseActive, setMouseActive] = useState(false)
  const mouseTimer = useRef<NodeJS.Timeout | null>(null)
  const mouseStartTime = useRef<number | null>(null)
  const [mouseTimeRemaining, setMouseTimeRemaining] = useState(MOUSE_TIME_LIMIT)

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const handleStartTest = useCallback(() => {
    setIsTestStarted(true)
    setShowInstructions(false)
    setTestSession({
      startTime: Date.now(),
      endTime: 0,
      duration: 60,
      warnings: 0,
      tabSwitches: 0,
      mouseTime: {},
      submissions: [],
    })
    setTimeRemaining(60 * 60) // Reset to 60 minutes
    setMouseTimeRemaining(MOUSE_TIME_LIMIT) // Reset mouse timer
    setWarnings(0)
    setTabSwitches(0)

    // Enter full screen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen()
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen()
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen()
    }
  }, [])

  // Prevent copy paste throughout the application
  useEffect(() => {
    const preventCopyPaste = (e: ClipboardEvent) => {
      if (isTestStarted) {
        e.preventDefault()
        return false
      }
    }

    const preventContextMenu = (e: MouseEvent) => {
      if (isTestStarted) {
        e.preventDefault()
        return false
      }
    }

    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      if (isTestStarted && (e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v")) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener("copy", preventCopyPaste)
    document.addEventListener("paste", preventCopyPaste)
    document.addEventListener("contextmenu", preventContextMenu)
    document.addEventListener("keydown", preventKeyboardShortcuts)

    return () => {
      document.removeEventListener("copy", preventCopyPaste)
      document.removeEventListener("paste", preventCopyPaste)
      document.removeEventListener("contextmenu", preventContextMenu)
      document.removeEventListener("keydown", preventKeyboardShortcuts)
    }
  }, [isTestStarted])

  // Mouse tracking
  useEffect(() => {
    if (!isTestStarted) return

    const handleMouseMove = () => {
      if (!mouseActive) {
        setMouseActive(true)
        mouseStartTime.current = Date.now()
        startMouseTimer()
      }
    }

    const handleMouseStop = () => {
      if (mouseActive) {
        setMouseActive(false)
        if (mouseTimer.current) {
          clearInterval(mouseTimer.current)
        }
        if (mouseStartTime.current) {
          const timeUsed = Math.floor((Date.now() - mouseStartTime.current) / 1000)
          setTestSession((prev) => ({
            ...prev,
            mouseTime: {
              ...prev.mouseTime,
              [currentQuestionIndex]: (prev.mouseTime[currentQuestionIndex] || 0) + timeUsed,
            },
          }))
        }
      }
    }

    const mouseStopTimeout = setTimeout(handleMouseStop, 1000)

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(mouseStopTimeout)
    }
  }, [isTestStarted, mouseActive, currentQuestionIndex])

  const startMouseTimer = () => {
    if (mouseTimer.current) {
      clearInterval(mouseTimer.current)
    }

    mouseTimer.current = setInterval(() => {
      setMouseTimeRemaining((prev) => {
        if (prev <= 1) {
          handleEndTest("Mouse time limit exceeded")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Move handleEndTest before addWarning
  const handleEndTest = useCallback((reason?: string) => {
    setIsTestStarted(false)
    setShowEndDialog(true)
    setTestSession((prev) => ({
      ...prev,
      endTime: Date.now(),
    }))
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }

    // If ended due to violations or time expiration, show alert and redirect
    if (reason) {
      alert(`Test terminated: ${reason}. You will be redirected to the main page.`)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }, []) // Empty dependency array since it doesn't depend on any props or state

  // Modified warning system
  const addWarning = useCallback(() => {
    setWarnings((prev) => {
      const newWarnings = prev + 1
      if (newWarnings >= MAX_WARNINGS) {
        handleEndTest("Maximum warnings reached")
      }
      return newWarnings
    })
  }, [handleEndTest])

  // Modify visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isTestStarted && document.hidden) {
        setTabSwitches((prev) => prev + 1)
        addWarning()
        setTestSession((prev) => ({
          ...prev,
          tabSwitches: prev.tabSwitches + 1,
          warnings: prev.warnings + 1,
        }))
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [isTestStarted, addWarning])

  // Modify fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (isTestStarted && !document.fullscreenElement) {
        addWarning()
        setTestSession((prev) => ({
          ...prev,
          warnings: prev.warnings + 1,
        }))
      }
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [isTestStarted, addWarning])

  // Add mouse time indicator to the header
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-4xl font-bold text-white drop-shadow-lg">Java Programming Test</h1>
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="bg-white/20 text-white px-3 py-2">
          <Timer className="mr-2 h-4 w-4" />
          Time Remaining: {formatTime(timeRemaining)}
        </Badge>
        <Badge variant="outline" className="bg-white/20 text-white px-3 py-2">
          <Mouse className="mr-2 h-4 w-4" />
          Mouse Time: {formatTime(mouseTimeRemaining)}
        </Badge>
        {warnings > 0 && (
          <Badge variant="destructive" className="px-3 py-2">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Warnings: {warnings}/{MAX_WARNINGS}
          </Badge>
        )}
        <Button variant="destructive" onClick={() => handleEndTest()} className="bg-red-500 hover:bg-red-600">
          End Test
        </Button>
      </div>
    </div>
  )

  // Update the warning alert message
  const renderWarningAlert = () =>
    warnings > 0 && (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Warning: {warnings === 1 ? "First" : "Final"} warning issued.
          {warnings === MAX_WARNINGS
            ? " Test will be terminated."
            : ` The test will be terminated after ${MAX_WARNINGS} warnings.`}
        </AlertDescription>
      </Alert>
    )

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTestStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleEndTest("Time's up!")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isTestStarted, timeRemaining, handleEndTest])

  useEffect(() => {
    const mockQuestions = [
      {
        Question: "Write a Java program to print 'Hello World' to the console.",
        Solution:
          'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}',
        Hint: "Use System.out.println() to print to the console.",
        ExpectedOutput: "Hello World",
        Points: 10,
      },
      {
        Question: "Create a program that calculates the sum of 5 and 10 and prints the result.",
        Solution:
          "public class Solution {\n    public static void main(String[] args {\n        int a = 5;\n        int b = 10;\n        int sum = a + b;\n        System.out.println(sum);\n    }\n}",
        Hint: "Declare two integer variables, add them together, and store the result in a third variable.",
        ExpectedOutput: "15",
        Points: 15,
      },
      {
        Question: "Write a program that checks if 7 is even or odd and prints the result.",
        Solution:
          'public class Solution {\n    public static void main(String[] args) {\n        int num = 7;\n        if(num % 2 == 0) {\n            System.out.println(num + " is even");\n        } else {\n            System.out.println(num + " is odd");\n        }\n    }\n}',
        Hint: "Use the modulo operator (%) to check if a number is divisible by 2.",
        ExpectedOutput: "7 is odd",
        Points: 20,
      },
      {
        Question: "Create a program that prints the first 5 numbers in the Fibonacci sequence.",
        Solution:
          'public class Solution {\n    public static void main(String[] args) {\n        int n1 = 0, n2 = 1, n3;\n        System.out.print(n1 + " " + n2);\n        for(int i = 2; i < 5; i++) {\n            n3 = n1 + n2;\n            System.out.print(" " + n3);\n            n1 = n2;\n            n2 = n3;\n        }\n    }\n}',
        Hint: "Start with 0 and 1, then each subsequent number is the sum of the two preceding ones.",
        ExpectedOutput: "0 1 1 2 3",
        Points: 25,
      },
      {
        Question: "Write a program to check if 'racecar' is a palindrome.",
        Solution:
          'public class Solution {\n    public static void main(String[] args) {\n        String str = "racecar";\n        String reversed = new StringBuilder(str).reverse().toString();\n        if(str.equals(reversed)) {\n            System.out.println(str + " is a palindrome");\n        } else {\n            System.out.println(str + " is not a palindrome");\n        }\n    }\n}',
        Hint: "A palindrome reads the same backward as forward. Try using StringBuilder's reverse() method.",
        ExpectedOutput: "racecar is a palindrome",
        Points: 30,
      },
    ]

    setQuestions(mockQuestions)
    setIsLoading(false)
  }, [])

  const currentQuestion = questions[currentQuestionIndex]

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowHint(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowHint(false)
    }
  }

  const handleRunCode = () => {
    if (!isTestStarted) {
      setOutput("Please start the test first!")
      return
    }

    setOutput("Running code...")

    setTimeout(() => {
      const simulatedOutput = simulateJavaExecution(code)
      setOutput(`Program executed successfully!\n\nOutput:\n${simulatedOutput}`)
    }, 1500)
  }

  const handleSubmitCode = () => {
    if (!isTestStarted) {
      setOutput("Please start the test first!")
      return
    }

    if (!currentQuestion) {
      setOutput("Error: No question selected")
      return
    }

    setOutput("Submitting solution...")

    setTimeout(() => {
      const simulatedOutput = simulateJavaExecution(code)
      const expectedOutput = currentQuestion.ExpectedOutput
      const isCorrect = simulatedOutput.trim() === expectedOutput.trim()

      setTestSession((prev) => ({
        ...prev,
        submissions: [
          ...prev.submissions,
          {
            questionIndex: currentQuestionIndex,
            code,
            isCorrect,
            timestamp: Date.now(),
          },
        ],
      }))

      if (isCorrect) {
        setOutput(
          `✅ Correct! Your solution passed the test case.\n\nYour output: "${simulatedOutput}"\nExpected: "${expectedOutput}"`,
        )
      } else {
        setOutput(
          `❌ Incorrect. Your solution did not match the expected output.\n\nYour output: "${simulatedOutput}"\nExpected: "${expectedOutput}"`,
        )
      }
    }, 2000)
  }

  const toggleHint = () => {
    if (!isTestStarted) {
      setOutput("Please start the test first!")
      return
    }
    setShowHint(!showHint)
  }

  const calculateScore = () => {
    const correctSubmissions = new Set()
    testSession.submissions.forEach((submission) => {
      if (submission.isCorrect) {
        correctSubmissions.add(submission.questionIndex)
      }
    })

    return Array.from(correctSubmissions).reduce((total, questionIndex) => {
      return total + questions[questionIndex as number].Points
    }, 0)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
        <div className="text-2xl font-bold text-white">Loading challenges...</div>
      </div>
    )
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/20 backdrop-blur-lg border-0 shadow-xl rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Java Programming Test Instructions</h1>

            <div className="space-y-4 text-white">
              <h2 className="text-xl font-semibold">Test Rules:</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>The test duration is 60 minutes</li>
                <li>You must remain in full-screen mode</li>
                <li>Switching tabs or windows will be recorded</li>
                <li>Three warnings will result in automatic test termination</li>
                <li>Each question has different point values</li>
                <li>You can attempt questions in any order</li>
                <li>Multiple submissions per question are allowed</li>
                <li>Only your last correct submission for each question counts</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6">Scoring:</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Question 1: 10 points</li>
                <li>Question 2: 15 points</li>
                <li>Question 3: 20 points</li>
                <li>Question 4: 25 points</li>
                <li>Question 5: 30 points</li>
                <li>Maximum total score: 100 points</li>
              </ul>

              <div className="mt-8">
                <Button onClick={handleStartTest} className="w-full bg-green-500 hover:bg-green-600 text-white">
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Start Test in Full Screen
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-6">
      <div className="max-w-7xl mx-auto">
        {renderHeader()}
        {renderWarningAlert()}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Panel */}
          <Card className="lg:col-span-1 bg-white/20 backdrop-blur-lg border-0 shadow-xl rounded-xl p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1">
                Question {currentQuestionIndex + 1}/{questions.length} ({currentQuestion?.Points} points)
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="bg-white/30 hover:bg-white/50 text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="bg-white/30 hover:bg-white/50 text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Problem:</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">{currentQuestion?.Question}</div>

              <Button
                variant="outline"
                onClick={toggleHint}
                className="w-full bg-yellow-400/70 hover:bg-yellow-500/70 text-white border-0"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>

              {showHint && currentQuestion?.Hint && (
                <div className="mt-4 bg-yellow-400/30 backdrop-blur-sm rounded-lg p-4 text-white">
                  <p className="font-medium">💡 Hint:</p>
                  <p>{currentQuestion.Hint}</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Question Progress:</h3>
              <Progress
                value={
                  testSession.submissions
                    .filter((s) => s.questionIndex === currentQuestionIndex)
                    .find((s) => s.isCorrect)
                    ? 100
                    : 0
                }
                className="h-2"
              />
            </div>
          </Card>

          {/* Code Editor Panel */}
          <Card className="lg:col-span-2 bg-white/20 backdrop-blur-lg border-0 shadow-xl rounded-xl overflow-hidden">
            <div className="bg-gray-800/70 text-white p-3 flex items-center">
              <Code className="mr-2 h-5 w-5" />
              <span className="font-medium">Java Editor</span>
            </div>
            <div className="h-[400px]">
              <CodeEditor value={code} onChange={setCode} language="java" />
            </div>
            <div className="p-4 bg-gray-800/50 flex gap-3">
              <Button onClick={handleRunCode} className="bg-green-500 hover:bg-green-600 text-white">
                <Play className="mr-2 h-4 w-4" />
                Run Code
              </Button>
              <Button onClick={handleSubmitCode} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Check className="mr-2 h-4 w-4" />
                Submit
              </Button>
            </div>
          </Card>

          {/* Output Panel */}
          <Card className="lg:col-span-3 bg-white/20 backdrop-blur-lg border-0 shadow-xl rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Output:</h3>
            <div className="bg-gray-800/70 text-green-400 p-4 rounded-lg font-mono text-sm h-[150px] overflow-auto">
              {output || "Code output will appear here..."}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Test Complete</DialogTitle>
            <DialogDescription>Here's your test summary:</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Final Score: {calculateScore()}/100</h3>
              <p>Time Taken: {formatTime(3600 - timeRemaining)}</p>
              <p>Questions Attempted: {new Set(testSession.submissions.map((s) => s.questionIndex)).size}</p>
              <p>
                Questions Correct:{" "}
                {new Set(testSession.submissions.filter((s) => s.isCorrect).map((s) => s.questionIndex)).size}
              </p>
              <p>Total Submissions: {testSession.submissions.length}</p>
              <p>Warnings Received: {warnings}</p>
              <p>Tab Switches: {tabSwitches}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => window.location.reload()}>Start New Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Simulation function remains the same
const simulateJavaExecution = (javaCode) => {
  if (javaCode.includes('System.out.println("Hello World")')) {
    return "Hello World"
  }

  if (
    javaCode.includes("int a = 5") &&
    javaCode.includes("int b = 10") &&
    javaCode.includes("int sum = a + b") &&
    (javaCode.includes("System.out.println(sum)") || javaCode.includes('System.out.println("Sum: " + sum)'))
  ) {
    return javaCode.includes('"Sum: "') ? "Sum: 15" : "15"
  }

  if (
    javaCode.includes("int num = 7") &&
    javaCode.includes("num % 2 == 0") &&
    javaCode.includes("is even") &&
    javaCode.includes("is odd")
  ) {
    return "7 is odd"
  }

  if (
    javaCode.includes("int n1 = 0") &&
    javaCode.includes("int n2 = 1") &&
    javaCode.includes("n3 = n1 + n2") &&
    javaCode.includes("System.out.print")
  ) {
    if (javaCode.includes("i < 5") || javaCode.includes("i <= 4")) {
      return "0 1 1 2 3"
    }
    return "0 1 1 2 3 5 8 13 21 34"
  }

  if (
    javaCode.includes('String str = "racecar"') &&
    javaCode.includes("StringBuilder") &&
    javaCode.includes("reverse()") &&
    javaCode.includes("equals")
  ) {
    return "racecar is a palindrome"
  }

  return "[Could not determine output - please check your code]"
}

