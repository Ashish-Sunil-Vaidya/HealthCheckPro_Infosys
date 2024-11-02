import { useEffect, useState } from 'react';
import {
    Box,
    Text,
    Button,
    HStack,
    Progress,
    Image,
    Grid,
    useBreakpointValue,
} from '@chakra-ui/react';

import questionBg from '../assets/question.png';
import SectionSteps from './SectionSteps';
import useCustomTheme from '../hooks/useCustomTheme';
import data from './dashboard_sections/data';

const Question = () => {
    const { cardBg } = useCustomTheme();
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);

    useEffect(() => {
        setCategories(data.map((category) => category.categoryName));
    }, []);

    useEffect(() => {
        console.log('Updated currentCategoryIndex:', currentCategoryIndex);
    }, [currentCategoryIndex]);

    const handleNextQuestion = () => {
        const currentCategory = data[currentCategoryIndex];
        if (currentQuestionIndex < currentCategory.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer('');
        } else if (currentCategoryIndex < data.length - 1) {
            setCurrentCategoryIndex((prev) => prev + 1);
            setCurrentQuestionIndex(0);
            setSelectedAnswer('');
        } else {
            setIsQuizCompleted(true);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedAnswer('');
        } else if (currentCategoryIndex > 0) {
            setCurrentCategoryIndex(currentCategoryIndex - 1);
            setCurrentQuestionIndex(data[currentCategoryIndex - 1].questions.length - 1);
            setSelectedAnswer('');
        }
        console.log('Previous Question:', currentCategoryIndex, currentQuestionIndex);
    };

    const StackComponent = useBreakpointValue({ base: Grid, md: HStack });

    if (isQuizCompleted) {
        return (
            <Box mt={20} w="100%" minH="100vh" p={6} display="flex" justifyContent="center" alignItems="center">
                <Text fontSize="2xl" fontWeight="bold">Quiz Completed! Thank you for participating.</Text>
            </Box>
        );
    }

    const currentCategory = data[currentCategoryIndex];
    const currentQuestion = currentCategory.questions[currentQuestionIndex];

    return (
        <Box mt={20} w="100%" minH="100vh" p={6} display="flex" justifyContent="center" alignItems="center">
            <Box  borderRadius="md" p={6} position="relative">
                <Box width="100%" overflowX="auto">
                    <SectionSteps currentCategoryIndex={currentCategoryIndex} categories={categories} />
                </Box>
                <Box mb={10} />
                <StackComponent w="100%" gap={2}>
                    <Progress w="full" colorScheme="blue" size="md" flex={1} value={(currentQuestionIndex + 1) / currentCategory.questions.length * 100} border="1px" borderColor="blue.500" rounded="full" />
                    <Text color="blue.500" fontSize="lg" fontWeight="bold" textAlign="right">
                        QUESTION {currentQuestionIndex + 1}/{currentCategory.questions.length}
                    </Text>
                </StackComponent>
                <Text fontSize="2xl" fontWeight="bold" my={6}>
                    {currentQuestion.questionText}
                </Text>
                <HStack w="100%" gap={10} position="relative">
                    <Box w={{ base: "100%", md: "50%" }} mb={4} display={{ base: "none", md: "flex" }} justifyContent="center">
                        <Image src={questionBg} alt="Illustration" width="full" />
                    </Box>
                    <Grid mt={4} gap={4} w="100%">
                        {currentQuestion.options.map((option, index) => (
                            <Button
                                key={index}
                                onClick={() => setSelectedAnswer(option.optionText)}
                                colorScheme="blue"
                                variant={selectedAnswer === option.optionText ? 'solid' : 'outline'}
                                size="lg"
                                w="100%"
                                mr={2}
                                boxShadow={selectedAnswer === option.optionText ? 'lg' : 'md'}

                            >
                                {option.optionText}
                            </Button>
                        ))}
                    </Grid>
                    <Image
                        src={questionBg}
                        alt="Illustration"
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        width="80%"
                        opacity={0.1}
                        display={{ base: "block", md: "none" }}
                    />
                </HStack>
                <HStack justify="space-between" mt={8}>
                    <Button colorScheme="gray" size="lg" onClick={handlePreviousQuestion} disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}>
                        Previous
                    </Button>
                    <Button colorScheme="blue" size="lg" onClick={handleNextQuestion}>
                        {currentCategoryIndex === data.length - 1 && currentQuestionIndex === currentCategory.questions.length - 1 ? 'Submit' : 'Next Question'}
                    </Button>
                </HStack>
            </Box>
        </Box>
    );
};

export default Question;
