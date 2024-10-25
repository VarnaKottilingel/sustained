'use client'

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState<'default' | 'handsfree' | 'manual'>('default')
  const [isListening, setIsListening] = useState(false)
  const [ingredients, setIngredients] = useState<string[]>([])
  const [currentIngredient, setCurrentIngredient] = useState('')
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const router = useRouter()

  const menuItems = [
    { name: "Bread", image: "/images/cake.jpg" },
    { name: "Salad", image: "/images/salad.jpg" },
    { name: "Smoothie", image: "/images/smoothie.jpg" },
    { name: "Wrap", image: "/images/simplewrap.jpg" },
  ]

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true

      recognitionInstance.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('')
        setTranscript(currentTranscript)
        setCurrentIngredient(currentTranscript)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % menuItems.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + menuItems.length) % menuItems.length)

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start()
      setIsListening(true)
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition])

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient.trim()])
      setCurrentIngredient('')
      setTranscript('')
    }
  }

  const handleModeSelect = (selectedMode: 'handsfree' | 'manual') => {
    setMode(selectedMode)
    if (selectedMode === 'handsfree') {
      startListening()
    }
  }

  const handleFindRecipes = () => {
    if (ingredients.length > 0) {
      router.push(`/inventory?ingredients=${encodeURIComponent(ingredients.join(','))}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="SustainedEats"
            width={100}
            height={200}
          />
          <span className="text-xl font-semibold">SustainedEats</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <a className="text-gray-600 hover:text-gray-900" href="#">Home</a>
          <a className="text-gray-600 hover:text-gray-900" href="#">How it Works</a>
          <a className="text-gray-600 hover:text-gray-900" href="#">FAQ</a>
        </nav>
        <div className="flex gap-2">
          <Button variant="ghost">Log In</Button>
          <Button>Sign Up</Button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto mt-16 px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">What's cooking today?</h1>
            <p className="text-xl text-gray-600 mb-6">
              No need to rush to the store! We've got you covered with expertly crafted meals based on what you already have.
            </p>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-6 py-3">Discover Now</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Choose Your Ingredient Input Method</DialogTitle>
                </DialogHeader>
                {mode === 'default' && (
                  <div className="space-y-4">
                    <Button 
                      className="w-full py-4 text-lg bg-green-500 hover:bg-green-600"
                      onClick={() => handleModeSelect('handsfree')}
                    >
                      <Mic className="mr-2 h-6 w-6" />
                      Go Hands-Free
                    </Button>
                    <Button 
                      className="w-full py-4 text-lg bg-blue-500 hover:bg-blue-600"
                      onClick={() => handleModeSelect('manual')}
                    >
                      
                      <ChevronRight className="mr-2 h-6 w-6" />
                      Enter Ingredients Manually
                      
                    </Button>
                  </div>
                )}
                {mode === 'handsfree' && (
                  <div className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                        🎤
                      </div>
                    </div>
                    <p className="text-center text-lg mb-4">
                      {isListening 
                        ? "I'm listening! Tell me what ingredients you have."
                        : "Click the microphone to start speaking."}
                    </p>
                    <Button 
                      className={`w-full py-4 text-lg ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      onClick={isListening ? stopListening : startListening}
                    >
                      {isListening ? <MicOff className="mr-2 h-6 w-6" /> : <Mic className="mr-2 h-6 w-6" />}
                      {isListening ? 'Stop Listening' : 'Start Listening'}
                    </Button>
                    {transcript && (
                      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                        <p className="font-semibold">Current input:</p>
                        <p>{transcript}</p>
                      </div>
                    )}
                  </div>
                )}
                {mode === 'manual' && (
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Enter an ingredient"
                      value={currentIngredient}
                      onChange={(e) => setCurrentIngredient(e.target.value)}
                      className="w-full"
                    />
                    <Button onClick={addIngredient} className="w-full bg-green-500 hover:bg-green-600">
                      Add Ingredient
                    </Button>
                  </div>
                )}
                {ingredients.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Your Ingredients:</h3>
                    <ul className="list-disc pl-5">
                      {ingredients.map((ingredient, index) => (
                        <li key={index} className="mb-1">{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {(mode === 'handsfree' || mode === 'manual') && ingredients.length > 0 && (
                  <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600" onClick={handleFindRecipes}>
                    Find Recipes
                  </Button>
                )}
                {(mode === 'handsfree' || mode === 'manual') && (
                  <Button 
                    className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800"
                    onClick={() => setMode('default')}
                  >
                    Back to Mode Selection
                  </Button>
                )}
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex-1">
            <Image
              src="/images/homepage.png"
              alt="Healthy salad with grilled salmon"
              width={400}
              height={400}
              className="rounded-full object-cover"
            />
          </div>
        </div>
        <div className="mt-16">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Specials</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevSlide}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous slide</span>
              </Button>
              <Button variant="outline" size="icon" onClick={nextSlide}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next slide</span>
              </Button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {menuItems.map((item, index) => (
              <div
                key={item.name}
                className={`flex-none w-40 transition-opacity duration-300 ${index === currentSlide ? "opacity-100" : "opacity-50"}`}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={160}
                  height={80}
                  className="rounded-lg mb-2"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}