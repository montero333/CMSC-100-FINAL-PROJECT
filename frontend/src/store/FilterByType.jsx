import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import './FilterByType.css'; // Import the CSS file

const FilterByType = ({ selectedType, handleTypeChange }) => {
    return (
    <div className="mb-4 button-group">
        <ButtonGroup>
            <Button
                className={`filter-button ${selectedType === 'all' ? 'selected-button' : ''}`}
                onClick={() => handleTypeChange('all')}
            >
                All
            </Button>
            <Button
                className={`filter-button ${selectedType === 'Crop' ? 'selected-button' : ''}`}
                onClick={() => handleTypeChange('Crop')}
            >
                Crops
            </Button>
            <Button
                className={`filter-button ${selectedType === 'Poultry' ? 'selected-button' : ''}`}
                onClick={() => handleTypeChange('Poultry')}
            >
                Poultry
            </Button>
        </ButtonGroup>
    </div>
    );
};

export default FilterByType;
