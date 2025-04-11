import { CreatePortfolioPayload, UpdatePortfolioPayload } from './type';

export const validatePortfolioPayload = (payload: CreatePortfolioPayload): string[] => {
    const errors: string[] = [];

    if (!payload.description) {
        errors.push('Description is required');
    } else if (payload.description.length < 10) {
        errors.push('Description must be at least 10 characters long');
    }

    if (payload.skills && !Array.isArray(payload.skills)) {
        errors.push('Skills must be an array');
    }

    if (payload.assets && !Array.isArray(payload.assets)) {
        errors.push('Assets must be an array');
    }

    if (payload.assets && payload.assets.length > 0) {
        payload.assets.forEach(asset => {
            if (!asset.id) {
                errors.push('Asset ID is required');
            }
            if (!asset.type) {
                errors.push('Asset type is required');
            }
            if (!asset.url) {
                errors.push('Asset URL is required');
            }
        });
    }

    if (!payload.createdBy) {
        errors.push('Creator ID is required');
    }

    return errors;
};

export const validateUpdatePortfolioPayload = (payload: UpdatePortfolioPayload): string[] => {
    const errors: string[] = [];

    if (payload.description && payload.description.length < 10) {
        errors.push('Description must be at least 10 characters long');
    }

    if (payload.skills && !Array.isArray(payload.skills)) {
        errors.push('Skills must be an array');
    }

    if (payload.assets && !Array.isArray(payload.assets)) {
        errors.push('Assets must be an array');
    }

    if (!payload.createdBy) {
        errors.push('Creator ID is required');
    }

    return errors;
};
