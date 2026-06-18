<?php

namespace Database\Seeders;

use App\Models\SustainableDevelopmentGoal;
use Illuminate\Database\Seeder;

class SustainableDevelopmentGoalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $goals = [
            [
                'sdg_number' => 1,
                'name' => 'No Poverty',
                'description' => 'End poverty in all its forms everywhere. Eradicate extreme poverty and halve the proportion of people living in poverty in all its dimensions.',
                'color_code' => '#E5243B',
                'icon_identifier' => 'sdg-01',
            ],
            [
                'sdg_number' => 2,
                'name' => 'Zero Hunger',
                'description' => 'End hunger, achieve food security and improved nutrition and promote sustainable agriculture.',
                'color_code' => '#DDA250',
                'icon_identifier' => 'sdg-02',
            ],
            [
                'sdg_number' => 3,
                'name' => 'Good Health and Well-Being',
                'description' => 'Ensure healthy lives and promote well-being for all at all ages.',
                'color_code' => '#4C9F38',
                'icon_identifier' => 'sdg-03',
            ],
            [
                'sdg_number' => 4,
                'name' => 'Quality Education',
                'description' => 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.',
                'color_code' => '#C6192B',
                'icon_identifier' => 'sdg-04',
            ],
            [
                'sdg_number' => 5,
                'name' => 'Gender Equality',
                'description' => 'Achieve gender equality and empower all women and girls.',
                'color_code' => '#DD3E39',
                'icon_identifier' => 'sdg-05',
            ],
            [
                'sdg_number' => 6,
                'name' => 'Clean Water and Sanitation',
                'description' => 'Ensure availability and sustainable management of water and sanitation for all.',
                'color_code' => '#26BDE2',
                'icon_identifier' => 'sdg-06',
            ],
            [
                'sdg_number' => 7,
                'name' => 'Affordable and Clean Energy',
                'description' => 'Ensure access to affordable, reliable, sustainable and modern energy for all.',
                'color_code' => '#FCCC0A',
                'icon_identifier' => 'sdg-07',
            ],
            [
                'sdg_number' => 8,
                'name' => 'Decent Work and Economic Growth',
                'description' => 'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.',
                'color_code' => '#A21E48',
                'icon_identifier' => 'sdg-08',
            ],
            [
                'sdg_number' => 9,
                'name' => 'Industry, Innovation and Infrastructure',
                'description' => 'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.',
                'color_code' => '#DD1C3B',
                'icon_identifier' => 'sdg-09',
            ],
            [
                'sdg_number' => 10,
                'name' => 'Reduced Inequalities',
                'description' => 'Reduce inequality within and among countries.',
                'color_code' => '#DD1C3B',
                'icon_identifier' => 'sdg-10',
            ],
            [
                'sdg_number' => 11,
                'name' => 'Sustainable Cities and Communities',
                'description' => 'Make cities and human settlements inclusive, safe, resilient and sustainable.',
                'color_code' => '#FD6925',
                'icon_identifier' => 'sdg-11',
            ],
            [
                'sdg_number' => 12,
                'name' => 'Responsible Consumption and Production',
                'description' => 'Ensure sustainable consumption and production patterns.',
                'color_code' => '#BF8B2E',
                'icon_identifier' => 'sdg-12',
            ],
            [
                'sdg_number' => 13,
                'name' => 'Climate Action',
                'description' => 'Take urgent action to combat climate change and its impacts.',
                'color_code' => '#3F7E44',
                'icon_identifier' => 'sdg-13',
            ],
            [
                'sdg_number' => 14,
                'name' => 'Life Below Water',
                'description' => 'Conserve and sustainably use oceans, seas and marine resources for sustainable development.',
                'color_code' => '#0A97D9',
                'icon_identifier' => 'sdg-14',
            ],
            [
                'sdg_number' => 15,
                'name' => 'Life on Land',
                'description' => 'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.',
                'color_code' => '#56C596',
                'icon_identifier' => 'sdg-15',
            ],
            [
                'sdg_number' => 16,
                'name' => 'Peace, Justice and Strong Institutions',
                'description' => 'Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.',
                'color_code' => '#0066CC',
                'icon_identifier' => 'sdg-16',
            ],
            [
                'sdg_number' => 17,
                'name' => 'Partnerships for the Goals',
                'description' => 'Strengthen the means of implementation and global partnership for sustainable development.',
                'color_code' => '#1B3562',
                'icon_identifier' => 'sdg-17',
            ],
        ];

        foreach ($goals as $goal) {
            SustainableDevelopmentGoal::create($goal);
        }
    }
}
