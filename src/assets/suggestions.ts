interface suggestionProps {
    imgUri: string,
    prompt: string,
}

const suggestions: suggestionProps[] = [
    {
        imgUri: 'https://images.pexels.com/photos/1766604/pexels-photo-1766604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        prompt: 'Happy to see you. I have learned a lot from you. What should we explore next? ',
    },
    {
        imgUri: 'https://images.pexels.com/photos/212324/pexels-photo-212324.jpeg?auto=compress&cs=tinysrgb&w=600',
        prompt: 'How can I stay healthy when spending time in nature?',
    },
    {
        imgUri: 'https://images.pexels.com/photos/70069/pexels-photo-70069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        prompt: 'Create a story about a little bird sitting on a branch of a tree.',
    },
    {
        imgUri: 'https://images.pexels.com/photos/3831187/pexels-photo-3831187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        prompt: 'Compose a folk song about a day in the life of a roaming cloud.',
    },
    {
        imgUri: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=600',
        prompt: 'Hey, please help me to create a plan for a vegetable garden.',
    },
    {
        imgUri: 'https://images.pexels.com/photos/3762927/pexels-photo-3762927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        prompt: 'What are some creative indoor hobbies that are easy to learn.',
    },
];

export default suggestions;